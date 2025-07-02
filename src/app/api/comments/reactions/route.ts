import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// POST - Like or dislike a comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentId, action } = body; // action: 'like' or 'dislike'

    if (!commentId || !['like', 'dislike'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Comment ID and valid action (like/dislike) are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('comments');

    // Check if comment exists
    const comment = await collection.findOne({ _id: new ObjectId(commentId) });
    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Update like or dislike count
    const updateField = action === 'like' ? 'likes' : 'dislikes';
    const currentCount = comment[updateField] || 0;

    const result = await collection.updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { [updateField]: currentCount + 1 } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to update comment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Comment ${action}d successfully`,
      data: {
        commentId,
        [updateField]: currentCount + 1
      }
    }, { headers: { 'Cache-Control': 'no-store, must-revalidate' } });

  } catch (error) {
    console.error('Error updating comment reaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update comment reaction' },
      { status: 500, headers: { 'Cache-Control': 'no-store, must-revalidate' } }
    );
  }
}
