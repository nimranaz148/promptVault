import { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { AuthUser } from '../types';
import { getProfileRole } from '../models/profile.model';

// Cache JWKS - fetched once, reused for every request (fast local verification)
const JWKS = createRemoteJWKSet(
  new URL(`${env.supabaseUrl}/auth/v1/.well-known/jwks.json`)
);

/**
 * Verifies the Supabase-issued JWT locally using JWKS public keys.
 * Supports ECC (P-256) and legacy HS256 without a network call per request.
 */
export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('Missing or malformed Authorization header');
    }

    const token = authHeader.slice('Bearer '.length);

    let payload: { sub?: string; email?: string };
    try {
      const result = await jwtVerify(token, JWKS, {
        issuer: `${env.supabaseUrl}/auth/v1`,
        audience: 'authenticated',
      });
      payload = result.payload as { sub?: string; email?: string };
    } catch {
      try {
        const secret = new TextEncoder().encode(env.supabaseJwtSecret);
        const result = await jwtVerify(token, secret, {
          issuer: `${env.supabaseUrl}/auth/v1`,
          audience: 'authenticated',
        });
        payload = result.payload as { sub?: string; email?: string };
      } catch {
        throw AppError.unauthorized('Invalid or expired token');
      }
    }

    if (!payload.sub) {
      throw AppError.unauthorized('Token missing subject claim');
    }

    const role = await getProfileRole(payload.sub);

    const user: AuthUser = {
      id: payload.sub,
      email: payload.email,
      role: role === 'admin' ? 'admin' : 'user',
    };

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/** Gate for Super-Admin-only routes (PRD Section 4 / Section 9 Admin group). */
export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(AppError.unauthorized());
  }
  if (req.user.role !== 'admin') {
    return next(AppError.forbidden('Admin access required'));
  }
  next();
}
