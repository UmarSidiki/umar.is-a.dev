import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    const db = await getDatabase();
    
    // Try to ping the database
    await db.admin().ping();
    
    console.log('MongoDB connection successful!');
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connection successful!',
      database: db.databaseName 
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
