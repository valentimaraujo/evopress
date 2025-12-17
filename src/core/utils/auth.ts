import { compare } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'JWT_SECRET não configurado! Configure a variável JWT_SECRET no ambiente de produção.'
      );
    }
    return 'evopress-dev-secret-key-123';
  }
  
  return secret;
};

const JWT_SECRET = getJwtSecret();
const key = new TextEncoder().encode(JWT_SECRET);

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return compare(plain, hashed);
}

export interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch {
    return null;
  }
}
