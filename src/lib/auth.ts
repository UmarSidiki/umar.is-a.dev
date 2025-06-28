import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

export interface AuthenticatedUser {
  username: string;
  role: string;
}

export function verifyAdminToken(request: NextRequest): AuthenticatedUser | null {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & AuthenticatedUser;
    
    if (decoded.role !== 'admin') {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export function requireAdminAuth(request: NextRequest): AuthenticatedUser {
  const user = verifyAdminToken(request);
  
  if (!user) {
    throw new Error('Unauthorized: Admin access required');
  }
  
  return user;
}
