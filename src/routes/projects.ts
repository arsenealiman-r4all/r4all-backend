import { Hono } from 'hono';
import type { Bindings, Project } from '../types';
import { authMiddleware } from '../middleware/auth';

const projects = new Hono<{ Bindings: Bindings }>();

// Public: Get all active projects
projects.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM projects WHERE is_active = 1 ORDER BY order_index ASC'
    ).all<Project>();
    
    return c.json({ projects: results });
  } catch (error) {
    console.error('Get projects error:', error);
    return c.json({ error: 'Erreur lors de la récupération des projets' }, 500);
  }
});

// Public: Get project by ID
projects.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const project = await c.env.DB.prepare(
      'SELECT * FROM projects WHERE id = ?'
    ).bind(id).first<Project>();
    
    if (!project) {
      return c.json({ error: 'Projet non trouvé' }, 404);
    }
    
    return c.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    return c.json({ error: 'Erreur lors de la récupération du projet' }, 500);
  }
});

// Protected routes
projects.use('/admin/*', authMiddleware);

// Admin: Get all projects
projects.get('/admin/all', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM projects ORDER BY order_index ASC'
    ).all<Project>();
    
    return c.json({ projects: results });
  } catch (error) {
    console.error('Get all projects error:', error);
    return c.json({ error: 'Erreur lors de la récupération des projets' }, 500);
  }
});

// Admin: Create project
projects.post('/admin', async (c) => {
  try {
    const data = await c.req.json<Project>();
    
    if (!data.title) {
      return c.json({ error: 'Le titre est requis' }, 400);
    }
    
    const result = await c.env.DB.prepare(
      `INSERT INTO projects (title, summary, description, country, city, status, capacity_kw, 
       beneficiaries, image_url, start_date, end_date, order_index, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      data.title,
      data.summary || null,
      data.description || null,
      data.country || null,
      data.city || null,
      data.status || 'en_cours',
      data.capacity_kw || null,
      data.beneficiaries || null,
      data.image_url || null,
      data.start_date || null,
      data.end_date || null,
      data.order_index || 0,
      data.is_active !== undefined ? data.is_active : 1
    ).run();
    
    return c.json({
      success: true,
      project: {
        id: result.meta.last_row_id,
        ...data
      }
    }, 201);
  } catch (error) {
    console.error('Create project error:', error);
    return c.json({ error: 'Erreur lors de la création du projet' }, 500);
  }
});

// Admin: Update project
projects.put('/admin/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json<Project>();
    
    const result = await c.env.DB.prepare(
      `UPDATE projects SET title = ?, summary = ?, description = ?, country = ?, city = ?, 
       status = ?, capacity_kw = ?, beneficiaries = ?, image_url = ?, start_date = ?, 
       end_date = ?, order_index = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(
      data.title,
      data.summary || null,
      data.description || null,
      data.country || null,
      data.city || null,
      data.status || 'en_cours',
      data.capacity_kw || null,
      data.beneficiaries || null,
      data.image_url || null,
      data.start_date || null,
      data.end_date || null,
      data.order_index || 0,
      data.is_active !== undefined ? data.is_active : 1,
      id
    ).run();
    
    if (result.meta.changes === 0) {
      return c.json({ error: 'Projet non trouvé' }, 404);
    }
    
    return c.json({ success: true, project: { id, ...data } });
  } catch (error) {
    console.error('Update project error:', error);
    return c.json({ error: 'Erreur lors de la mise à jour du projet' }, 500);
  }
});

// Admin: Delete project
projects.delete('/admin/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await c.env.DB.prepare(
      'DELETE FROM projects WHERE id = ?'
    ).bind(id).run();
    
    if (result.meta.changes === 0) {
      return c.json({ error: 'Projet non trouvé' }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return c.json({ error: 'Erreur lors de la suppression du projet' }, 500);
  }
});

export default projects;
