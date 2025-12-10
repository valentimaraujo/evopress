import jwt from 'jsonwebtoken';
import { compare } from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'default-dev-secret';

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return compare(plain, hashed);
}

export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

