import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 401, headers: { 'Cache-Control': 'no-store, must-revalidate' } }
      );
    }
    
    return NextResponse.json(
      { message: 'Admin API endpoint', success: true },
      { headers: { 'Cache-Control': 'no-store, must-revalidate', 'Vary': 'Authorization' } }
    );
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: { 'Cache-Control': 'no-store, must-revalidate' } }
    );
  }
}
