import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch comments for a blog post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('postSlug');
    
    if (!postSlug) {
      return NextResponse.json(
        { success: false, error: 'Post slug is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('comments');

    const comments = await collection
      .find({ postSlug: postSlug, status: 'approved' })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: comments
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
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
      parentId: parentId || undefined
    };

    const result = await commentsCollection.insertOne(comment);

    return NextResponse.json({
      success: true,
      message: 'Comment submitted successfully and is pending approval',
      data: { ...comment, _id: result.insertedId }
    });

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
    });

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
    });

  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
