import { Hono } from 'hono';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { zValidator } from '@hono/zod-validator';
import { loginSchema } from '@portfolio/shared';

const auth = new Hono();

auth.post('/login', zValidator('json', loginSchema), async (c) => {
  const { password } = c.req.valid('json');

  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const jwtSecret    = process.env.JWT_SECRET;

  if (!passwordHash || !jwtSecret) {
    return c.json({ success: false, error: 'Server configuration error' }, 500);
  }

  const isValid = await compare(password, passwordHash);
  if (!isValid) {
    // Constant-time response to prevent timing attacks
    return c.json({ success: false, error: 'Invalid credentials' }, 401);
  }

  const expiresIn = 60 * 60 * 8; // 8 hours
  const token = sign({ role: 'admin' }, jwtSecret, { expiresIn });

  return c.json({
    success: true,
    data: { token, expiresIn },
  });
});

auth.post('/logout', (c) => {
  // JWT is stateless — client drops the token
  // Server-side: could add to a blocklist here if needed
  return c.json({ success: true, message: 'Logged out successfully' });
});

export default auth;
