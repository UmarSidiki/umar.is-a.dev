import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyAdminToken } from '@/lib/auth';

// GET - Fetch all projects or a specific project
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const admin = searchParams.get('admin') === 'true';
    
    // Don't cache admin requests
    const headers = admin ? 
      { 'Cache-Control': 'no-store' } : 
      { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' };

    const db = await getDatabase();
    const collection = db.collection('projects');

    // For admin requests, verify authentication
    if (admin) {
      const user = verifyAdminToken(request);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: Admin access required' },
          { status: 401, headers }
        );
      }
    }

    if (id) {
      // Fetch single project by ID
      const project = await collection.findOne({ _id: new ObjectId(id) });
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404, headers });
      }
      return NextResponse.json({ success: true, data: project }, { headers });
    }

    // Build query
    const query: Record<string, unknown> = {};
    if (status) query.status = status;
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
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

// POST - Create a new project (admin only)
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

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and category are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('projects');

    // Parse arrays from strings
    const technologies = body.technologies
      .split(',')
      .map((tech: string) => tech.trim())
      .filter((tech: string) => tech.length > 0);

    const images = body.images
      ? body.images.split(',').map((img: string) => img.trim()).filter((img: string) => img.length > 0)
      : [];

    // Create project
    const now = new Date();
    const project = {
      title: body.title.trim(),
      description: body.description.trim(),
      longDescription: body.longDescription?.trim() || '',
      technologies,
      category: body.category.trim(),
      status: body.status || 'active',
      featured: Boolean(body.featured),
      githubUrl: body.githubUrl?.trim() || '',
      liveUrl: body.liveUrl?.trim() || '',
      imageUrl: body.imageUrl?.trim() || '',
      images,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      client: body.client?.trim() || '',
      teamSize: body.teamSize ? parseInt(body.teamSize) : undefined,
      role: body.role?.trim() || '',
      createdAt: now,
      updatedAt: now
    };

    const result = await collection.insertOne(project);

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      data: { ...project, _id: result.insertedId }
    });

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing project (admin only)
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
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!updateData.title || !updateData.description || !updateData.category) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and category are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('projects');

    // Check if project exists
    const existingProject = await collection.findOne({ _id: new ObjectId(id) });
    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Parse arrays from strings
    const technologies = updateData.technologies
      .split(',')
      .map((tech: string) => tech.trim())
      .filter((tech: string) => tech.length > 0);

    const images = updateData.images
      ? updateData.images.split(',').map((img: string) => img.trim()).filter((img: string) => img.length > 0)
      : [];

    // Update project
    const updatedProject = {
      title: updateData.title.trim(),
      description: updateData.description.trim(),
      longDescription: updateData.longDescription?.trim() || '',
      technologies,
      category: updateData.category.trim(),
      status: updateData.status || 'active',
      featured: Boolean(updateData.featured),
      githubUrl: updateData.githubUrl?.trim() || '',
      liveUrl: updateData.liveUrl?.trim() || '',
      imageUrl: updateData.imageUrl?.trim() || '',
      images,
      startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
      endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
      client: updateData.client?.trim() || '',
      teamSize: updateData.teamSize ? parseInt(updateData.teamSize) : undefined,
      role: updateData.role?.trim() || '',
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
    });

  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a project (admin only)
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
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('projects');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
