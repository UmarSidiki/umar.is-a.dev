import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyAdminToken } from '@/lib/auth';

// GET - Fetch comments for a blog post
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
      // Verify admin authentication for fetching all comments
      const user = verifyAdminToken(request);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: Admin access required' },
          { status: 401, headers: { 'Cache-Control': 'no-store' } }
        );
      }

      const allComments = await collection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      return NextResponse.json({
        success: true,
        data: allComments
      }, { headers: { 'Cache-Control': 'private, max-age=30, stale-while-revalidate=60' } });
    }
    
    if (!postSlug) {
      return NextResponse.json(
        { success: false, error: 'Post slug is required when not fetching all comments' },
        { status: 400 }
      );
    }

    // Define sort options
    let sortOrder: { [key: string]: 1 | -1 } = { createdAt: -1 }; // newest first by default
    
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
      .find({ postSlug: postSlug, status: 'approved' })
      .sort(sortOrder)
      .toArray();

    // Organize comments with replies
    const commentsMap = new Map();
    const rootComments: unknown[] = [];

    // First pass: organize all comments
    allComments.forEach(comment => {
      const commentWithReplies = {
        ...comment,
        replies: [],
        likes: comment.likes || 0,
        dislikes: comment.dislikes || 0
      };
      
      commentsMap.set(comment._id.toString(), commentWithReplies);
      
      if (!comment.parentId) {
        rootComments.push(commentWithReplies);
      }
    });

    // Second pass: attach replies to their parents
    allComments.forEach(comment => {
      if (comment.parentId) {
        const parent = commentsMap.get(comment.parentId);
        if (parent) {
          const commentWithReplies = commentsMap.get(comment._id.toString());
          parent.replies.push(commentWithReplies);
        }
      }
    });

    // Enhanced caching for public comments
    return NextResponse.json({
      success: true,
      data: rootComments
    }, { headers: { 
      'Cache-Control': 'public, max-age=120, s-maxage=300, stale-while-revalidate=3600',
      'Vary': 'Accept-Encoding'
    } });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

// POST - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postSlug, author, email, content, parentId } = body;

    // Validate required fields
    if (!postSlug || !author || !email || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const commentsCollection = db.collection('comments');
    const postsCollection = db.collection('blogposts');

    // Check if post exists
    const post = await postsCollection.findOne({ slug: postSlug });
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Create comment
    const comment = {
      postSlug,
      author: author.trim(),
      email: email.trim(),
      content: content.trim(),
      createdAt: new Date(),
      status: 'pending',
      parentId: parentId || undefined,
      likes: 0,
      dislikes: 0
    };

    const result = await commentsCollection.insertOne(comment);

    return NextResponse.json({
      success: true,
      message: 'Comment submitted successfully and is pending approval',
      data: { ...comment, _id: result.insertedId }
    }, { headers: { 'Cache-Control': 'no-store, must-revalidate' } });

  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

// PUT - Approve/reject a comment (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { commentId, status } = body;

    if (!commentId || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Comment ID and valid status are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('comments');

    const result = await collection.updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { status: status } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Comment ${status} successfully`
    }, { headers: { 'Cache-Control': 'no-store, must-revalidate' } });

  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a comment (admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');

    if (!commentId) {
      return NextResponse.json(
        { success: false, error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('comments');

    const result = await collection.deleteOne({ _id: new ObjectId(commentId) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully'
    }, { headers: { 'Cache-Control': 'no-store, must-revalidate' } });

  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
