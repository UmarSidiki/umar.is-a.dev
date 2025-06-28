import { MongoClient, Db } from 'mongodb';

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// Optimize MongoDB options for Vercel serverless functions
const options = {
  maxPoolSize: 5, // Reduce pool size for serverless
  serverSelectionTimeoutMS: 10000, // Increase timeout for serverless
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  maxIdleTimeMS: 30000,
  family: 4,
  retryWrites: true,
  w: 'majority' as const,
};

let client: MongoClient;
const clientPromise: Promise<MongoClient> = (() => {
  // Use global variable in all environments to prevent connection issues
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
})();

export async function getDatabase(): Promise<Db> {
  try {
    const client = await clientPromise;
    return client.db('portfolio');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Helper function to check MongoDB connection
export async function checkConnection(): Promise<boolean> {
  try {
    const client = await clientPromise;
    await client.db('admin').command({ ping: 1 });
    return true;
  } catch (error) {
    console.error('MongoDB ping failed:', error);
    return false;
  }
}

export default clientPromise;
