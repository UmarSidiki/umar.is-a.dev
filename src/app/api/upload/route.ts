import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { requireAdmin } from '@/lib/auth';

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || '';
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || '';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// MIME type -> canonical extension. SVG is intentionally excluded (it can
// carry scripts); the extension is derived from the MIME type, never from the
// client-supplied filename.
const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

const noStore = { 'Cache-Control': 'private, no-store, must-revalidate' };

function createS3Client(): S3Client {
  if (!process.env.CLOUDFLARE_R2_ENDPOINT || !process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || !process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
    throw new Error('Cloudflare R2 configuration is missing');
  }

  return new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
  });
}

function sanitizeFolder(folder: unknown): string {
  if (typeof folder !== 'string' || !folder.trim()) {
    return 'uploads';
  }
  const cleaned = folder.trim().replace(/^\/+|\/+$/g, '');
  if (!cleaned || cleaned.length > 200 || cleaned.includes('..') || !/^[A-Za-z0-9][A-Za-z0-9/_-]*$/.test(cleaned)) {
    return 'uploads';
  }
  return cleaned;
}

function matchesImageSignature(buffer: Buffer, mime: string): boolean {
  if (buffer.length < 12) return false;
  switch (mime) {
    case 'image/jpeg':
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case 'image/png':
      return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    case 'image/gif':
      return buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38;
    case 'image/webp':
      return buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
    case 'image/avif':
      return buffer.toString('ascii', 4, 8) === 'ftyp' && /avif|avis/.test(buffer.toString('ascii', 8, 12));
    default:
      return false;
  }
}

function isValidObjectKey(key: string): boolean {
  if (!key || key.length > 512) return false;
  if (key.includes('..') || key.startsWith('/')) return false;
  return /^[A-Za-z0-9][A-Za-z0-9/_.-]*$/.test(key);
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      return auth.response;
    }

    if (!BUCKET_NAME || !PUBLIC_URL) {
      console.error('Upload failed: CLOUDFLARE_R2_BUCKET_NAME / CLOUDFLARE_R2_PUBLIC_URL are not set.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500, headers: noStore });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const folder = sanitizeFolder(formData.get('folder'));

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400, headers: noStore });
    }

    const canonicalExtension = ALLOWED_MIME_TYPES[file.type];
    if (!canonicalExtension) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, GIF, and AVIF are allowed.' },
        { status: 400, headers: noStore }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400, headers: noStore }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (!matchesImageSignature(buffer, file.type)) {
      return NextResponse.json(
        { error: 'File contents do not match the declared image type.' },
        { status: 400, headers: noStore }
      );
    }

    // Key is generated entirely server-side; the client filename is ignored.
    const objectKey = `${folder}/${uuidv4()}.${canonicalExtension}`;

    const s3Client = createS3Client();
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(uploadCommand);

    return NextResponse.json({
      success: true,
      url: `${PUBLIC_URL}/${objectKey}`,
      fileName: objectKey,
      size: file.size,
      type: file.type,
    }, { headers: noStore });

  } catch (error) {
    console.error('Upload error:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { error: 'Failed to upload file' },
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
    const fileName = searchParams.get('fileName');

    if (!fileName || !isValidObjectKey(fileName)) {
      return NextResponse.json({ error: 'Invalid file name' }, { status: 400, headers: noStore });
    }

    const s3Client = createS3Client();
    const deleteCommand = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    await s3Client.send(deleteCommand);

    return NextResponse.json(
      { success: true },
      { headers: noStore }
    );

  } catch (error) {
    console.error('Delete error:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500, headers: noStore }
    );
  }
}
