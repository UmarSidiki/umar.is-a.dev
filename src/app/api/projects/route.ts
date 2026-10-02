import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { requireAdmin, getSession } from '@/lib/auth';

const PUBLIC_CACHE = 'public, s-maxage=60, stale-while-revalidate=300';
const PRIVATE_CACHE = 'private, no-store, must-revalidate';

function isValidObjectId(value: string): boolean {
  return /^[a-f0-9]{24}$/i.test(value);
}

// GET - Fetch all projects or a specific project
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const rawLimit = parseInt(searchParams.get('limit') || '10', 10);
    const rawPage = parseInt(searchParams.get('page') || '1', 10);
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 100) : 10;
    const page = Number.isFinite(rawPage) ? Math.max(rawPage, 1) : 1;
    const admin = searchParams.get('admin') === 'true';

    const adminUser = admin ? await getSession(request) : null;
    if (admin && !adminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 401, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    const headers = { 'Cache-Control': adminUser ? PRIVATE_CACHE : PUBLIC_CACHE };

    const db = await getDatabase();
    const collection = db.collection('projects');

    if (id) {
      if (!isValidObjectId(id)) {
        return NextResponse.json({ error: 'Invalid project id' }, { status: 400, headers });
      }
      // Fetch single project by ID
      const project = await collection.findOne({ _id: new ObjectId(id) });
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404, headers });
      }
      return NextResponse.json({ success: true, data: project }, { headers });
    }

    // Build query
    const query: Record<string, unknown> = {};
    if (status && typeof status === 'string') query.status = status;
    if (featured === 'true') query.featured = true;
    if (category && category !== 'all') query.category = category;

    const skip = (page - 1) * limit;
    const projects = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }, { headers });

  } catch (error) {
    console.error('Error fetching projects:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500, headers: { 'Cache-Control': PRIVATE_CACHE } }
    );
  }
}

function parseCsv(value: unknown): string[] {
  if (typeof value !== 'string') return [];
  return value
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

// POST - Create a new project (admin only)
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.description || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and category are required' },
        { status: 400, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('projects');

    const technologies = parseCsv(body.technologies);
    const images = parseCsv(body.images);

    // Create project
    const now = new Date();
    const project = {
      title: String(body.title).trim(),
      description: String(body.description).trim(),
      longDescription: body.longDescription ? String(body.longDescription).trim() : '',
      technologies,
      category: String(body.category).trim(),
      status: body.status || 'active',
      featured: Boolean(body.featured),
      githubUrl: body.githubUrl ? String(body.githubUrl).trim() : '',
      liveUrl: body.liveUrl ? String(body.liveUrl).trim() : '',
      imageUrl: body.imageUrl ? String(body.imageUrl).trim() : '',
      images,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      client: body.client ? String(body.client).trim() : '',
      teamSize: body.teamSize ? parseInt(body.teamSize, 10) : undefined,
      role: body.role ? String(body.role).trim() : '',
      createdAt: now,
      updatedAt: now
    };

    const result = await collection.insertOne(project);

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      data: { ...project, _id: result.insertedId }
    }, { headers: { 'Cache-Control': PRIVATE_CACHE } });

  } catch (error) {
    console.error('Error creating project:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500, headers: { 'Cache-Control': PRIVATE_CACHE } }
    );
  }
}

// PUT - Update an existing project (admin only)
export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Valid project ID is required' },
        { status: 400, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    // Validate required fields
    if (!updateData.title || !updateData.description || !updateData.category) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and category are required' },
        { status: 400, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('projects');

    // Check if project exists
    const existingProject = await collection.findOne({ _id: new ObjectId(id) });
    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    const technologies = parseCsv(updateData.technologies);
    const images = parseCsv(updateData.images);

    // Update project
    const updatedProject = {
      title: String(updateData.title).trim(),
      description: String(updateData.description).trim(),
      longDescription: updateData.longDescription ? String(updateData.longDescription).trim() : '',
      technologies,
      category: String(updateData.category).trim(),
      status: updateData.status || 'active',
      featured: Boolean(updateData.featured),
      githubUrl: updateData.githubUrl ? String(updateData.githubUrl).trim() : '',
      liveUrl: updateData.liveUrl ? String(updateData.liveUrl).trim() : '',
      imageUrl: updateData.imageUrl ? String(updateData.imageUrl).trim() : '',
      images,
      startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
      endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
      client: updateData.client ? String(updateData.client).trim() : '',
      teamSize: updateData.teamSize ? parseInt(updateData.teamSize, 10) : undefined,
      role: updateData.role ? String(updateData.role).trim() : '',
      updatedAt: new Date()
    };

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedProject }
    );

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      data: { ...updatedProject, _id: id }
    }, { headers: { 'Cache-Control': PRIVATE_CACHE } });

  } catch (error) {
    console.error('Error updating project:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500, headers: { 'Cache-Control': PRIVATE_CACHE } }
    );
  }
}

// DELETE - Delete a project (admin only)
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
        { success: false, error: 'Valid project ID is required' },
        { status: 400, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('projects');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404, headers: { 'Cache-Control': PRIVATE_CACHE } }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    }, { headers: { 'Cache-Control': PRIVATE_CACHE } });

  } catch (error) {
    console.error('Error deleting project:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500, headers: { 'Cache-Control': PRIVATE_CACHE } }
    );
  }
}
