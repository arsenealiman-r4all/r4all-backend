import { Hono } from 'hono';
import type { Bindings, Value } from '../types';
import { authMiddleware } from '../middleware/auth';

const values = new Hono<{ Bindings: Bindings }>();

values.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM company_values WHERE is_active = 1 ORDER BY order_index ASC'
  ).all<Value>();
  return c.json({ values: results });
});

values.use('/admin/*', authMiddleware);

values.get('/admin/all', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM company_values ORDER BY order_index ASC').all<Value>();
  return c.json({ values: results });
});

values.post('/admin', async (c) => {
  const data = await c.req.json<Value>();
  if (!data.title) return c.json({ error: 'Titre requis' }, 400);
  
  const result = await c.env.DB.prepare(
    'INSERT INTO company_values (title, subtitle, description, icon, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(data.title, data.subtitle || null, data.description || null, data.icon || null, data.order_index || 0, data.is_active !== undefined ? data.is_active : 1).run();
  
  return c.json({ success: true, value: { id: result.meta.last_row_id, ...data } }, 201);
});

values.put('/admin/:id', async (c) => {
  const id = c.req.param('id');
  const data = await c.req.json<Value>();
  
  const result = await c.env.DB.prepare(
    'UPDATE company_values SET title = ?, subtitle = ?, description = ?, icon = ?, order_index = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(data.title, data.subtitle || null, data.description || null, data.icon || null, data.order_index || 0, data.is_active !== undefined ? data.is_active : 1, id).run();
  
  if (result.meta.changes === 0) return c.json({ error: 'Valeur non trouvée' }, 404);
  return c.json({ success: true, value: { id, ...data } });
});

values.delete('/admin/:id', async (c) => {
  const id = c.req.param('id');
  const result = await c.env.DB.prepare('DELETE FROM company_values WHERE id = ?').bind(id).run();
  if (result.meta.changes === 0) return c.json({ error: 'Valeur non trouvée' }, 404);
  return c.json({ success: true });
});

export default values;
