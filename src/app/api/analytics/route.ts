import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// GET - Fetch analytics data
export async function GET() {
  try {
    const db = await getDatabase();
    const postsCollection = db.collection('blogposts');
    const commentsCollection = db.collection('comments');

    // Get basic counts
    const [totalPosts, publishedPosts, totalComments, pendingComments] = await Promise.all([
      postsCollection.countDocuments(),
      postsCollection.countDocuments({ status: 'published' }),
      commentsCollection.countDocuments(),
      commentsCollection.countDocuments({ status: 'pending' })
    ]);

    // Get recent published posts
    const recentPosts = await postsCollection
      .find({ status: 'published' })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Get recent comments with post titles
    const recentComments = await commentsCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();

    // Get category distribution from actual posts
    const categoryAggregation = await postsCollection.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray();

    const topCategories = categoryAggregation.map(cat => ({
      name: cat._id || 'Uncategorized',
      posts: cat.count
    }));

    // Build real recent activity from posts and comments
    const recentActivity = [];
    
    // Add recent posts
    if (recentPosts.length > 0) {
      recentActivity.push({
        type: 'post',
        content: `Post published: "${recentPosts[0].title}"`,
        timestamp: new Date(recentPosts[0].createdAt).toISOString()
      });
    }
    
    // Add recent comments
    if (recentComments.length > 0) {
      recentActivity.push({
        type: 'comment',
        content: `New comment from ${recentComments[0].author}`,
        timestamp: new Date(recentComments[0].createdAt).toISOString()
      });
    }

    // Sort by timestamp
    recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const analytics = {
      totalPosts,
      publishedPosts,
      draftPosts: totalPosts - publishedPosts,
      totalComments,
      pendingComments,
      recentPosts: recentPosts.map(post => ({
        title: post.title,
        slug: post.slug,
        category: post.category,
        createdAt: post.createdAt
      })),
      recentActivity: recentActivity.slice(0, 5),
      topCategories
    };

    return NextResponse.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
