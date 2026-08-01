import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { notFound } from './middleware/errorHandler';
import healthRouter   from './routes/health';
import authRouter     from './routes/auth';
import projectsRouter from './routes/projects';
import skillsRouter   from './routes/skills';
import timelineRouter from './routes/timeline';
import bioRouter      from './routes/bio';
import contactRouter  from './routes/contact';
import syncRouter     from './routes/sync';

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
