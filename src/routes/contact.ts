import { Hono } from 'hono';
import type { Bindings, ContactMessage } from '../types';
import { authMiddleware } from '../middleware/auth';

const contact = new Hono<{ Bindings: Bindings }>();

// Public: Submit contact message
contact.post('/', async (c) => {
  try {
    const data = await c.req.json<ContactMessage>();
    
    if (!data.name || !data.email || !data.message) {
      return c.json({ error: 'Nom, email et message requis' }, 400);
    }
    
    const result = await c.env.DB.prepare(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)'
    ).bind(data.name, data.email, data.phone || null, data.subject || null, data.message).run();
    
    return c.json({
      success: true,
      message: 'Votre message a été envoyé avec succès',
      id: result.meta.last_row_id
    }, 201);
  } catch (error) {
    console.error('Submit contact error:', error);
    return c.json({ error: 'Erreur lors de l\'envoi du message' }, 500);
  }
});

// Protected routes
contact.use('/admin/*', authMiddleware);

// Admin: Get all messages
contact.get('/admin/all', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    ).all<ContactMessage>();
    
    return c.json({ messages: results });
  } catch (error) {
    console.error('Get messages error:', error);
    return c.json({ error: 'Erreur lors de la récupération des messages' }, 500);
  }
});

// Admin: Get unread messages count
contact.get('/admin/unread-count', async (c) => {
  try {
    const result = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0'
    ).first<{ count: number }>();
    
    return c.json({ count: result?.count || 0 });
  } catch (error) {
    console.error('Get unread count error:', error);
    return c.json({ error: 'Erreur lors de la récupération du nombre de messages' }, 500);
  }
});

// Admin: Mark message as read
contact.put('/admin/:id/read', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await c.env.DB.prepare(
      'UPDATE contact_messages SET is_read = 1 WHERE id = ?'
    ).bind(id).run();
    
    if (result.meta.changes === 0) {
      return c.json({ error: 'Message non trouvé' }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Mark as read error:', error);
    return c.json({ error: 'Erreur lors de la mise à jour du message' }, 500);
  }
});

// Admin: Delete message
contact.delete('/admin/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await c.env.DB.prepare(
      'DELETE FROM contact_messages WHERE id = ?'
    ).bind(id).run();
    
    if (result.meta.changes === 0) {
      return c.json({ error: 'Message non trouvé' }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete message error:', error);
    return c.json({ error: 'Erreur lors de la suppression du message' }, 500);
  }
});

export default contact;
