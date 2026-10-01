import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { BlogPost, BlogPostFormData, generateSlug, calculateReadTime, validateBlogPost } from '@/types/blog';
import { ObjectId } from 'mongodb';
import { requireAdmin, getSession } from '@/lib/auth';

const PRIVATE_CACHE = 'private, no-store, must-revalidate';

function isValidObjectId(value: string): boolean {
  return /^[a-f0-9]{24}$/i.test(value);
}

function isValidSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 200;
}

// GET - Fetch blog posts. Public callers only ever see published posts;
// admins (valid session cookie) may see drafts and filter by status.
export async function GET(request: NextRequest) {
  const admin = await getSession(request);
  const isAdmin = admin !== null;
  // The same URL returns drafts to an authenticated admin and published-only
  // to the public, and the Vercel CDN does not key its cache on cookies, so
  // this route must never be cached publicly. `no-store` also keeps a newly
  // published post immediately visible.
  const headers = { 'Cache-Control': PRIVATE_CACHE };

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const status = searchParams.get('status');
    const rawLimit = parseInt(searchParams.get('limit') || '10', 10);
    const rawPage = parseInt(searchParams.get('page') || '1', 10);
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 100) : 10;
    const page = Number.isFinite(rawPage) ? Math.max(rawPage, 1) : 1;

    const db = await getDatabase();
    const collection = db.collection<BlogPost>('blogposts');

    if (id) {
      if (!isValidObjectId(id)) {
        return NextResponse.json({ error: 'Invalid post id' }, { status: 400, headers });
      }
      const query: Record<string, unknown> = { _id: new ObjectId(id) };
      if (!isAdmin) query.status = 'published';
      const post = await collection.findOne(query);
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404, headers });
      }
      return NextResponse.json({ success: true, data: post }, { headers });
    }

    if (slug) {
      const query: Record<string, unknown> = { slug };
      if (!isAdmin) query.status = 'published';
      const post = await collection.findOne(query);
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404, headers });
      }
      return NextResponse.json({ success: true, data: post }, { headers });
    }

    // Fetch multiple posts with pagination.
    // Public callers only ever see published posts. An authenticated admin
    // may filter by an explicit status, or (with no status param) sees drafts
    // and published posts alike, which the admin dashboard relies on.
    const query: Record<string, unknown> = {};
    if (isAdmin) {
      if (status === 'draft' || status === 'published') {
        query.status = status;
      }
    } else {
      query.status = 'published';
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
    }, { headers });

  } catch (error) {
    console.error('Error fetching blog posts:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500, headers }
    );
  }
}

// POST - Create a new blog post (admin only)
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = (await request.json()) as BlogPostFormData;

    // Validate the blog post data
    const errors = validateBlogPost(body);
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors },
        { status: 400, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<BlogPost>('blogposts');

    // Support custom slug (url) from admin
    let slug = body.slug && body.slug.trim() ? body.slug.trim() : generateSlug(body.title);
    if (!isValidSlug(slug)) {
      return NextResponse.json(
        { success: false, error: 'Invalid slug. Use lowercase letters, numbers and hyphens.' },
        { status: 400, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    // Check for duplicates
    const existingPost = await collection.findOne({ slug });
    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }

    // Parse tags
    const tags = body.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

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

    const result = await collection.insertOne(blogPost);

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      data: { ...blogPost, _id: result.insertedId }
    }, { headers: { 'Cache-Control': 'private, no-store, must-revalidate' } });

  } catch (error) {
    console.error('Error creating blog post:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { success: false, error: 'Failed to create blog post' },
      { status: 500, headers: { 'Cache-Control': 'private, no-store, must-revalidate' } }
    );
  }
}

// PUT - Update an existing blog post (admin only)
export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const { id, ...updateData } = body as { id?: string } & BlogPostFormData;

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Valid post ID is required' },
        { status: 400, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    // Validate the blog post data
    const errors = validateBlogPost(updateData);
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors },
        { status: 400, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<BlogPost>('blogposts');

    // Check if post exists
    const existingPost = await collection.findOne({ _id: new ObjectId(id) });
    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    // Keep slug unchanged unless explicitly set by admin
    let slug = existingPost.slug;
    if (typeof updateData.slug === 'string' && updateData.slug.trim() && updateData.slug !== existingPost.slug) {
      slug = updateData.slug.trim();
      if (!isValidSlug(slug)) {
        return NextResponse.json(
          { success: false, error: 'Invalid slug. Use lowercase letters, numbers and hyphens.' },
          { status: 400, headers: { 'Cache-Control': PRIVATE_CACHE } }
        );
      }
      // Check for duplicate slug
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
    }, { headers: { 'Cache-Control': 'private, no-store, must-revalidate' } });

  } catch (error) {
    console.error('Error updating blog post:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { success: false, error: 'Failed to update blog post' },
      { status: 500, headers: { 'Cache-Control': 'private, no-store, must-revalidate' } }
    );
  }
}

// DELETE - Delete a blog post (admin only)
export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Valid post ID is required' },
        { status: 400, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<BlogPost>('blogposts');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    }, { headers: { 'Cache-Control': 'private, no-store, must-revalidate' } });

  } catch (error) {
    console.error('Error deleting blog post:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog post' },
      { status: 500, headers: { 'Cache-Control': 'private, no-store, must-revalidate' } }
    );
  }
}
