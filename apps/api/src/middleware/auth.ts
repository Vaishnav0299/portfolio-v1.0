import { type Context, type Next } from 'hono';
import { verify } from 'jsonwebtoken';

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Unauthorized: Missing or malformed token' }, 401);
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('JWT_SECRET environment variable is not configured');
    return c.json({ success: false, error: 'Server configuration error' }, 500);
  }

  try {
    const payload = verify(token, secret);
    c.set('jwtPayload', payload);
    await next();
  } catch (err) {
    return c.json({ success: false, error: 'Unauthorized: Invalid or expired token' }, 401);
  }
}
