import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const noStore = { 'Cache-Control': 'no-store, must-revalidate' };

  try {
    const user = await getSession(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401, headers: noStore }
      );
    }

    return NextResponse.json(
      { success: true, user: { username: user.username, role: user.role } },
      { headers: noStore }
    );
  } catch (error) {
    console.error('Token verification error:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: noStore }
    );
  }
}
