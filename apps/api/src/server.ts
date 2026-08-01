import { serve } from '@hono/node-server';
import app from './index';

const port = Number(process.env.PORT) || 3001;

console.log(`🚀 Hono API dev server listening at http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
  hostname: '127.0.0.1',
});
