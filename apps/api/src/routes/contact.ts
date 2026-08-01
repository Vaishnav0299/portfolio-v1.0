import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db } from '../db/client.js';
import { messages } from '../db/schema.js';
import { contactSchema } from '@portfolio/shared';

const contact = new Hono();

// ── PUBLIC: POST /api/contact ────────────────────────────────────────────────
contact.post('/', zValidator('json', contactSchema), async (c) => {
  const { name, email, message } = c.req.valid('json');

  // 1. Save to database
  await db.insert(messages).values({ name, email, message });

  // 2. Forward to Web3Forms (fire-and-forget, non-blocking)
  const accessKey = process.env.VITE_WEB3FORMS_ACCESS_KEY;
  if (accessKey) {
    const payload = new FormData();
    payload.append('access_key', accessKey);
    payload.append('name', name);
    payload.append('email', email);
    payload.append('message', message);
    payload.append('from_name', 'Portfolio Contact Form');
    payload.append('subject', `[Portfolio Message] New message from ${name}`);

    fetch('https://api.web3forms.com/submit', { method: 'POST', body: payload }).catch((err) =>
      console.warn('[Contact] Web3Forms forwarding failed:', err.message)
    );
  }

  return c.json({
    success: true,
    message: 'Message received! I\'ll get back to you soon.',
  });
});

export default contact;
