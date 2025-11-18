import { Hono } from 'hono';
import type { Bindings, Event } from '../types';
import { authMiddleware } from '../middleware/auth';

const events = new Hono<{ Bindings: Bindings }>();

events.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM events WHERE is_active = 1 ORDER BY date DESC'
  ).all<Event>();
  return c.json({ events: results });
});

events.get('/:id', async (c) => {
  const id = c.req.param('id');
  const event = await c.env.DB.prepare('SELECT * FROM events WHERE id = ?').bind(id).first<Event>();
  if (!event) return c.json({ error: 'Événement non trouvé' }, 404);
  return c.json({ event });
});

events.use('/admin/*', authMiddleware);

events.get('/admin/all', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM events ORDER BY date DESC').all<Event>();
  return c.json({ events: results });
});

events.post('/admin', async (c) => {
  const data = await c.req.json<Event>();
  if (!data.title || !data.date) return c.json({ error: 'Titre et date requis' }, 400);
  
  const result = await c.env.DB.prepare(
    'INSERT INTO events (title, description, date, location, image_url, registration_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(data.title, data.description || null, data.date, data.location || null, data.image_url || null, data.registration_url || null, data.is_active !== undefined ? data.is_active : 1).run();
  
  return c.json({ success: true, event: { id: result.meta.last_row_id, ...data } }, 201);
});

events.put('/admin/:id', async (c) => {
  const id = c.req.param('id');
  const data = await c.req.json<Event>();
  
  const result = await c.env.DB.prepare(
    'UPDATE events SET title = ?, description = ?, date = ?, location = ?, image_url = ?, registration_url = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(data.title, data.description || null, data.date, data.location || null, data.image_url || null, data.registration_url || null, data.is_active !== undefined ? data.is_active : 1, id).run();
  
  if (result.meta.changes === 0) return c.json({ error: 'Événement non trouvé' }, 404);
  return c.json({ success: true, event: { id, ...data } });
});

events.delete('/admin/:id', async (c) => {
  const id = c.req.param('id');
  const result = await c.env.DB.prepare('DELETE FROM events WHERE id = ?').bind(id).run();
  if (result.meta.changes === 0) return c.json({ error: 'Événement non trouvé' }, 404);
  return c.json({ success: true });
});

export default events;
