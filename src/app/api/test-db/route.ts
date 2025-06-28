import { NextResponse } from 'next/server';
import { getDatabase, checkConnection } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection on Vercel...');
    console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);
    console.log('Environment:', process.env.NODE_ENV);
    
    // Test connection first
    const isConnected = await checkConnection();
    if (!isConnected) {
      throw new Error('MongoDB ping failed');
    }
    
    const db = await getDatabase();
    
    // Try a simple operation
    const collections = await db.listCollections().toArray();
    
    console.log('MongoDB connection successful!');
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connection successful!',
      database: db.databaseName,
      collections: collections.map(c => c.name),
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : String(error),
        environment: process.env.NODE_ENV,
        hasMongoUri: !!process.env.MONGODB_URI
      },
      { status: 500 }
    );
  }
}
