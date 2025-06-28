import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { BlogPost, BlogPostFormData, generateSlug, calculateReadTime, validateBlogPost } from '@/types/blog';
import { ObjectId } from 'mongodb';
import { verifyAdminToken } from '@/lib/auth';

// GET - Fetch all blog posts or a specific post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    const db = await getDatabase();
    const collection = db.collection<BlogPost>('blogposts');

    if (id) {
      // Fetch single post by ID
      const post = await collection.findOne({ _id: new ObjectId(id) });
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: post });
    }

    if (slug) {
      // Fetch single post by slug
      const post = await collection.findOne({ slug });
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: post });
    }

    // Fetch multiple posts with pagination
    const query: Record<string, unknown> = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const posts = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST - Create a new blog post (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    console.log('POST /api/blog - Starting...');
    const body: BlogPostFormData = await request.json();
    console.log('Request body:', body);

    // Validate the blog post data
    const errors = validateBlogPost(body);
    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors },
        { status: 400 }
      );
    }

    console.log('Getting database...');
    const db = await getDatabase();
    const collection = db.collection<BlogPost>('blogposts');
    console.log('Database connection successful');

    // Generate slug and check for duplicates
    let slug = generateSlug(body.title);
    console.log('Generated slug:', slug);
    
    const existingPost = await collection.findOne({ slug });
    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
      console.log('Slug updated to avoid duplicate:', slug);
    }

    // Parse tags
    const tags = body.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    console.log('Parsed tags:', tags);

    // Create blog post
    const now = new Date();
    const blogPost: BlogPost = {
      title: body.title.trim(),
      slug,
      content: body.content.trim(),
      excerpt: body.excerpt.trim(),
      author: body.author.trim(),
      tags,
      category: body.category.trim(),
      status: body.status,
      featuredImage: body.featuredImage?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
      publishedAt: body.status === 'published' ? now : undefined,
      readTime: calculateReadTime(body.content)
    };

    console.log('Blog post object:', blogPost);
    
    const result = await collection.insertOne(blogPost);
    console.log('Insert result:', result);

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      data: { ...blogPost, _id: result.insertedId }
    });

  } catch (error) {
    console.error('Error creating blog post:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { success: false, error: 'Failed to create blog post', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// PUT - Update an existing blog post (admin only)
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
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Validate the blog post data
    const errors = validateBlogPost(updateData);
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<BlogPost>('blogposts');

    // Check if post exists
    const existingPost = await collection.findOne({ _id: new ObjectId(id) });
    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Generate new slug if title changed
    let slug = existingPost.slug;
    if (updateData.title !== existingPost.title) {
      slug = generateSlug(updateData.title);
      const duplicatePost = await collection.findOne({ 
        slug, 
        _id: { $ne: new ObjectId(id) } 
      });
      if (duplicatePost) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Parse tags
    const tags = updateData.tags
      .split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0);

    // Update blog post
    const now = new Date();
    const updatedPost = {
      title: updateData.title.trim(),
      slug,
      content: updateData.content.trim(),
      excerpt: updateData.excerpt.trim(),
      author: updateData.author.trim(),
      tags,
      category: updateData.category.trim(),
      status: updateData.status,
      featuredImage: updateData.featuredImage?.trim() || undefined,
      updatedAt: now,
      publishedAt: updateData.status === 'published' && existingPost.status !== 'published' 
        ? now 
        : existingPost.publishedAt,
      readTime: calculateReadTime(updateData.content)
    };

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedPost }
    );

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      data: { ...updatedPost, _id: id }
    });

  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a blog post (admin only)
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<BlogPost>('blogposts');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
