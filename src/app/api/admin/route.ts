import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const noStore = { 'Cache-Control': 'no-store, must-revalidate' };

  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  return NextResponse.json(
    { message: 'Admin API endpoint', success: true },
    { headers: noStore }
  );
}
