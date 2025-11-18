import { Hono } from 'hono';
import type { Bindings, Partner } from '../types';
import { authMiddleware } from '../middleware/auth';

const partners = new Hono<{ Bindings: Bindings }>();

partners.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM partners WHERE is_active = 1 ORDER BY order_index ASC'
  ).all<Partner>();
  return c.json({ partners: results });
});

partners.get('/:type', async (c) => {
  const type = c.req.param('type');
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM partners WHERE type = ? AND is_active = 1 ORDER BY order_index ASC'
  ).bind(type).all<Partner>();
  return c.json({ partners: results });
});

partners.use('/admin/*', authMiddleware);

partners.get('/admin/all', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM partners ORDER BY type, order_index ASC').all<Partner>();
  return c.json({ partners: results });
});

partners.post('/admin', async (c) => {
  const data = await c.req.json<Partner>();
  if (!data.name || !data.type) return c.json({ error: 'Nom et type requis' }, 400);
  
  const result = await c.env.DB.prepare(
    'INSERT INTO partners (name, type, description, logo_url, website_url, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(data.name, data.type, data.description || null, data.logo_url || null, data.website_url || null, data.order_index || 0, data.is_active !== undefined ? data.is_active : 1).run();
  
  return c.json({ success: true, partner: { id: result.meta.last_row_id, ...data } }, 201);
});

partners.put('/admin/:id', async (c) => {
  const id = c.req.param('id');
  const data = await c.req.json<Partner>();
  
  const result = await c.env.DB.prepare(
    'UPDATE partners SET name = ?, type = ?, description = ?, logo_url = ?, website_url = ?, order_index = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(data.name, data.type, data.description || null, data.logo_url || null, data.website_url || null, data.order_index || 0, data.is_active !== undefined ? data.is_active : 1, id).run();
  
  if (result.meta.changes === 0) return c.json({ error: 'Partenaire non trouvé' }, 404);
  return c.json({ success: true, partner: { id, ...data } });
});

partners.delete('/admin/:id', async (c) => {
  const id = c.req.param('id');
  const result = await c.env.DB.prepare('DELETE FROM partners WHERE id = ?').bind(id).run();
  if (result.meta.changes === 0) return c.json({ error: 'Partenaire non trouvé' }, 404);
  return c.json({ success: true });
});

export default partners;
