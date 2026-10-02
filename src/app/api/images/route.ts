import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { requireAdmin } from '@/lib/auth';

// Configure Cloudflare R2 client
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || '';
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || '';

const ALLOWED_IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|gif|avif)$/i;

function isValidObjectKey(key: string): boolean {
  if (!key || key.length > 512) return false;
  if (key.includes('..')) return false;
  if (key.startsWith('/')) return false;
  return /^[A-Za-z0-9][A-Za-z0-9/_.-]*$/.test(key);
}

const noStore = { 'Cache-Control': 'private, no-store, must-revalidate' };

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      return auth.response;
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || '';
    const parsedLimit = parseInt(searchParams.get('limit') || '50', 10);
    const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 200) : 50;

    if (folder && !isValidObjectKey(folder)) {
      return NextResponse.json({ error: 'Invalid folder' }, { status: 400, headers: noStore });
    }

    // List objects from R2
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: folder,
      MaxKeys: limit,
    });

    const response = await s3Client.send(listCommand);

    const images = (response.Contents || [])
      .filter(obj => ALLOWED_IMAGE_EXTENSIONS.test(obj.Key || ''))
      .map(obj => ({
        key: obj.Key,
        url: `${PUBLIC_URL}/${obj.Key}`,
        size: obj.Size,
        lastModified: obj.LastModified,
        folder: obj.Key?.split('/')[0] || 'uploads',
        filename: obj.Key?.split('/').pop() || '',
      }))
      .sort((a, b) => (b.lastModified?.getTime() || 0) - (a.lastModified?.getTime() || 0));

    return NextResponse.json({
      success: true,
      images,
      total: images.length,
    }, { headers: noStore });

  } catch (error) {
    console.error('List images error:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { error: 'Failed to list images' },
      { status: 500, headers: noStore }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      return auth.response;
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key || !isValidObjectKey(key)) {
      return NextResponse.json({ error: 'Invalid image key' }, { status: 400, headers: noStore });
    }

    // Delete from Cloudflare R2
    const deleteCommand = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(deleteCommand);

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    }, { headers: noStore });

  } catch (error) {
    console.error('Delete image error:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500, headers: noStore }
    );
  }
}
