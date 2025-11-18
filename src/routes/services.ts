import { Hono } from 'hono';
import type { Bindings, Service } from '../types';
import { authMiddleware } from '../middleware/auth';

const services = new Hono<{ Bindings: Bindings }>();

// Public: Get all active services
services.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM services WHERE is_active = 1 ORDER BY order_index ASC'
    ).all<Service>();
    
    return c.json({ services: results });
  } catch (error) {
    console.error('Get services error:', error);
    return c.json({ error: 'Erreur lors de la récupération des services' }, 500);
  }
});

// Public: Get service by ID
services.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const service = await c.env.DB.prepare(
      'SELECT * FROM services WHERE id = ?'
    ).bind(id).first<Service>();
    
    if (!service) {
      return c.json({ error: 'Service non trouvé' }, 404);
    }
    
    return c.json({ service });
  } catch (error) {
    console.error('Get service error:', error);
    return c.json({ error: 'Erreur lors de la récupération du service' }, 500);
  }
});

// Protected routes
services.use('/admin/*', authMiddleware);

// Admin: Get all services (including inactive)
services.get('/admin/all', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM services ORDER BY order_index ASC'
    ).all<Service>();
    
    return c.json({ services: results });
  } catch (error) {
    console.error('Get all services error:', error);
    return c.json({ error: 'Erreur lors de la récupération des services' }, 500);
  }
});

// Admin: Create service
services.post('/admin', async (c) => {
  try {
    const data = await c.req.json<Service>();
    
    if (!data.title) {
      return c.json({ error: 'Le titre est requis' }, 400);
    }
    
    const result = await c.env.DB.prepare(
      'INSERT INTO services (title, description, icon, image_url, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(
      data.title,
      data.description || null,
      data.icon || null,
      data.image_url || null,
      data.order_index || 0,
      data.is_active !== undefined ? data.is_active : 1
    ).run();
    
    return c.json({
      success: true,
      service: {
        id: result.meta.last_row_id,
        ...data
      }
    }, 201);
  } catch (error) {
    console.error('Create service error:', error);
    return c.json({ error: 'Erreur lors de la création du service' }, 500);
  }
});

// Admin: Update service
services.put('/admin/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json<Service>();
    
    const result = await c.env.DB.prepare(
      'UPDATE services SET title = ?, description = ?, icon = ?, image_url = ?, order_index = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(
      data.title,
      data.description || null,
      data.icon || null,
      data.image_url || null,
      data.order_index || 0,
      data.is_active !== undefined ? data.is_active : 1,
      id
    ).run();
    
    if (result.meta.changes === 0) {
      return c.json({ error: 'Service non trouvé' }, 404);
    }
    
    return c.json({ success: true, service: { id, ...data } });
  } catch (error) {
    console.error('Update service error:', error);
    return c.json({ error: 'Erreur lors de la mise à jour du service' }, 500);
  }
});

// Admin: Delete service
services.delete('/admin/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await c.env.DB.prepare(
      'DELETE FROM services WHERE id = ?'
    ).bind(id).run();
    
    if (result.meta.changes === 0) {
      return c.json({ error: 'Service non trouvé' }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete service error:', error);
    return c.json({ error: 'Erreur lors de la suppression du service' }, 500);
  }
});

export default services;
