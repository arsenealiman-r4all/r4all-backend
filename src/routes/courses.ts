import { Hono } from 'hono';
import type { Bindings, Course } from '../types';
import { authMiddleware } from '../middleware/auth';

const courses = new Hono<{ Bindings: Bindings }>();

courses.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM courses WHERE is_active = 1 ORDER BY order_index ASC'
  ).all<Course>();
  return c.json({ courses: results });
});

courses.get('/:id', async (c) => {
  const id = c.req.param('id');
  const course = await c.env.DB.prepare('SELECT * FROM courses WHERE id = ?').bind(id).first<Course>();
  if (!course) return c.json({ error: 'Formation non trouvée' }, 404);
  return c.json({ course });
});

courses.use('/admin/*', authMiddleware);

courses.get('/admin/all', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM courses ORDER BY order_index ASC').all<Course>();
  return c.json({ courses: results });
});

courses.post('/admin', async (c) => {
  const data = await c.req.json<Course>();
  if (!data.title) return c.json({ error: 'Titre requis' }, 400);
  
  const result = await c.env.DB.prepare(
    'INSERT INTO courses (title, description, duration, price, certification, enroll_link, image_url, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(data.title, data.description || null, data.duration || null, data.price || null, data.certification ? 1 : 0, data.enroll_link || null, data.image_url || null, data.order_index || 0, data.is_active !== undefined ? data.is_active : 1).run();
  
  return c.json({ success: true, course: { id: result.meta.last_row_id, ...data } }, 201);
});

courses.put('/admin/:id', async (c) => {
  const id = c.req.param('id');
  const data = await c.req.json<Course>();
  
  const result = await c.env.DB.prepare(
    'UPDATE courses SET title = ?, description = ?, duration = ?, price = ?, certification = ?, enroll_link = ?, image_url = ?, order_index = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(data.title, data.description || null, data.duration || null, data.price || null, data.certification ? 1 : 0, data.enroll_link || null, data.image_url || null, data.order_index || 0, data.is_active !== undefined ? data.is_active : 1, id).run();
  
  if (result.meta.changes === 0) return c.json({ error: 'Formation non trouvée' }, 404);
  return c.json({ success: true, course: { id, ...data } });
});

courses.delete('/admin/:id', async (c) => {
  const id = c.req.param('id');
  const result = await c.env.DB.prepare('DELETE FROM courses WHERE id = ?').bind(id).run();
  if (result.meta.changes === 0) return c.json({ error: 'Formation non trouvée' }, 404);
  return c.json({ success: true });
});

export default courses;
