import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import {
  getClientIp,
  isRateLimited,
  recordRateLimitAttempt,
  rateLimitExceededResponse,
} from '@/lib/auth';

const REACTION_WINDOW_MS = 60 * 1000;
const REACTION_MAX_ATTEMPTS = 30;
const noStore = { 'Cache-Control': 'private, no-store, must-revalidate' };

function isValidObjectId(value: string): boolean {
  return /^[a-f0-9]{24}$/i.test(value);
}

// POST - Like or dislike a comment (public)
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateKey = `reaction:${ip}`;
    if (isRateLimited(rateKey, REACTION_MAX_ATTEMPTS)) {
      return rateLimitExceededResponse();
    }
    recordRateLimitAttempt(rateKey, REACTION_WINDOW_MS);

    const body = await request.json();
    const { commentId, action } = (body ?? {}) as Record<string, unknown>;

    if (typeof commentId !== 'string' || !isValidObjectId(commentId) || typeof action !== 'string' || !['like', 'dislike'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Valid comment ID and action (like/dislike) are required' },
        { status: 400, headers: noStore }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('comments');

    // Only approved comments can be reacted to.
    const comment = await collection.findOne({ _id: new ObjectId(commentId), status: 'approved' });
    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404, headers: noStore }
      );
    }

    const updateField = action === 'like' ? 'likes' : 'dislikes';
    const result = await collection.updateOne(
      { _id: new ObjectId(commentId) },
      { $inc: { [updateField]: 1 } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to update comment' },
        { status: 500, headers: noStore }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Comment ${action}d successfully`,
      data: {
        commentId,
        [updateField]: (comment[updateField] || 0) + 1
      }
    }, { headers: noStore });

  } catch (error) {
    console.error('Error updating comment reaction:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { success: false, error: 'Failed to update comment reaction' },
      { status: 500, headers: noStore }
    );
  }
}
