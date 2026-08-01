import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { notFound } from './middleware/errorHandler.js';
import healthRouter   from './routes/health.js';
import authRouter     from './routes/auth.js';
import projectsRouter from './routes/projects.js';
import skillsRouter   from './routes/skills.js';
import timelineRouter from './routes/timeline.js';
import bioRouter      from './routes/bio.js';
import contactRouter  from './routes/contact.js';
import syncRouter     from './routes/sync.js';

const app = new Hono().basePath('/api');

// ── Global Middleware ────────────────────────────────────────────────────────
app.use('*', cors({
  origin: process.env.ALLOWED_ORIGIN ?? '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// ── Routes ───────────────────────────────────────────────────────────────────
app.route('/health',   healthRouter);
app.route('/auth',     authRouter);
app.route('/projects', projectsRouter);
app.route('/skills',   skillsRouter);
app.route('/timeline', timelineRouter);
app.route('/bio',      bioRouter);
app.route('/contact',  contactRouter);
app.route('/sync',     syncRouter);

// ── 404 fallback ────────────────────────────────────────────────────────────
app.notFound(notFound);

export default app;
