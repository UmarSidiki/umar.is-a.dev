import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import {
  requireAdmin,
  getClientIp,
  isRateLimited,
  recordRateLimitAttempt,
  rateLimitExceededResponse,
} from '@/lib/auth';

const PUBLIC_CACHE = 'public, s-maxage=60, stale-while-revalidate=300';
const PRIVATE_CACHE = 'private, no-store, must-revalidate';

const COMMENT_WINDOW_MS = 10 * 60 * 1000;
const COMMENT_MAX_ATTEMPTS = 5;

function isValidObjectId(value: string): boolean {
  return /^[a-f0-9]{24}$/i.test(value);
}

function isValidSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 200;
}

function stripPrivateFields(comment: Record<string, unknown>): Record<string, unknown> {
  const safe = { ...comment };
  delete safe.email;
  delete safe.ip;
  return safe;
}

// GET - Fetch comments for a blog post (public: approved only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('postSlug');
    const sortBy = searchParams.get('sort') || 'newest';
    const all = searchParams.get('all') === 'true';

    const db = await getDatabase();
    const collection = db.collection('comments');

    // If fetching all comments (for admin)
    if (all) {
      const auth = await requireAdmin(request);
      if (!auth.ok) {
        return auth.response;
      }

      const allComments = await collection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return NextResponse.json({
        success: true,
        data: allComments.map(stripPrivateFields)
      }, { headers: { 'Cache-Control': PRIVATE_CACHE } });
    }

    if (!postSlug || !isValidSlug(postSlug)) {
      return NextResponse.json(
        { success: false, error: 'Valid post slug is required' },
        { status: 400, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    // Define sort options
    let sortOrder: { [key: string]: 1 | -1 } = { createdAt: -1 };

    switch (sortBy) {
      case 'oldest':
        sortOrder = { createdAt: 1 };
        break;
      case 'popular':
        sortOrder = { likes: -1, createdAt: -1 };
        break;
      case 'newest':
      default:
        sortOrder = { createdAt: -1 };
        break;
    }

    // Fetch all approved comments for the post
    const allComments = await collection
      .find({ postSlug, status: 'approved' })
      .sort(sortOrder)
      .toArray();

    // Organize comments with replies
    const commentsMap = new Map();
    const rootComments: unknown[] = [];

    allComments.forEach(comment => {
      const commentWithReplies = {
        ...stripPrivateFields(comment),
        replies: [],
        likes: comment.likes || 0,
        dislikes: comment.dislikes || 0
      };

      commentsMap.set(comment._id.toString(), commentWithReplies);

      if (!comment.parentId) {
        rootComments.push(commentWithReplies);
      }
    });

    allComments.forEach(comment => {
      if (comment.parentId) {
        const parent = commentsMap.get(comment.parentId);
        if (parent) {
          const commentWithReplies = commentsMap.get(comment._id.toString());
          parent.replies.push(commentWithReplies);
        }
      }
    });

    // This listing is genuinely public: it only ever contains approved comments
    // and never consults the session, so the same URL returns the same body to
    // everyone and a short public CDN cache is safe.
    return NextResponse.json({
      success: true,
      data: rootComments
    }, { headers: { 'Cache-Control': PUBLIC_CACHE } });

  } catch (error) {
    console.error('Error fetching comments:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500, headers: { 'Cache-Control': PRIVATE_CACHE } }
    );
  }
}

// POST - Create a new comment (public)
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateKey = `comment:${ip}`;
    if (isRateLimited(rateKey, COMMENT_MAX_ATTEMPTS)) {
      return rateLimitExceededResponse();
    }
    recordRateLimitAttempt(rateKey, COMMENT_WINDOW_MS);

    const body = await request.json();
    const { postSlug, author, email, content, parentId } = (body ?? {}) as Record<string, unknown>;

    // Only accept primitive strings; objects/arrays are rejected outright to
    // prevent NoSQL operator injection.
    if (
      typeof postSlug !== 'string' ||
      typeof author !== 'string' ||
      typeof email !== 'string' ||
      typeof content !== 'string'
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid required fields' },
        { status: 400, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    if (!postSlug.trim() || !author.trim() || !email.trim() || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    if (!isValidSlug(postSlug.trim())) {
      return NextResponse.json(
        { success: false, error: 'Invalid post slug' },
        { status: 400, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    if (author.trim().length > 100 || content.trim().length > 5000 || email.trim().length > 254) {
      return NextResponse.json(
        { success: false, error: 'One or more fields exceed the maximum length' },
        { status: 400, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    const safeParentId = typeof parentId === 'string' && isValidObjectId(parentId) ? parentId : undefined;

    const db = await getDatabase();
    const commentsCollection = db.collection('comments');
    const postsCollection = db.collection('blogposts');

    // Check if post exists and is published
    const post = await postsCollection.findOne({ slug: postSlug.trim(), status: 'published' });
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    // Create comment. Status and counters are always server-controlled.
    const comment = {
      postSlug: postSlug.trim(),
      author: author.trim(),
      email: email.trim(),
      content: content.trim(),
      createdAt: new Date(),
      status: 'pending',
      parentId: safeParentId,
      likes: 0,
      dislikes: 0
    };

    const result = await commentsCollection.insertOne(comment);

    return NextResponse.json({
      success: true,
      message: 'Comment submitted successfully and is pending approval',
      data: { ...stripPrivateFields(comment), _id: result.insertedId }
    }, { headers: { 'Cache-Control': PRIVATE_CACHE } });

  } catch (error) {
    console.error('Error creating comment:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500, headers: { 'Cache-Control': PRIVATE_CACHE } }
    );
  }
}

// PUT - Approve/reject a comment (admin only)
export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const { commentId, status } = body;

    if (!commentId || !isValidObjectId(String(commentId)) || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Valid comment ID and status are required' },
        { status: 400, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('comments');

    const result = await collection.updateOne(
      { _id: new ObjectId(String(commentId)) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Comment ${status} successfully`
    }, { headers: { 'Cache-Control': PRIVATE_CACHE } });

  } catch (error) {
    console.error('Error updating comment:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { success: false, error: 'Failed to update comment' },
      { status: 500, headers: { 'Cache-Control': PRIVATE_CACHE } }
    );
  }
}

// DELETE - Delete a comment (admin only)
export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');

    if (!commentId || !isValidObjectId(commentId)) {
      return NextResponse.json(
        { success: false, error: 'Valid comment ID is required' },
        { status: 400, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('comments');

    const result = await collection.deleteOne({ _id: new ObjectId(commentId) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully'
    }, { headers: { 'Cache-Control': PRIVATE_CACHE } });

  } catch (error) {
    console.error('Error deleting comment:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { success: false, error: 'Failed to delete comment' },
      { status: 500, headers: { 'Cache-Control': PRIVATE_CACHE } }
    );
  }
}
