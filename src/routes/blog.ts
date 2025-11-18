import { Hono } from 'hono';
import type { Bindings, BlogPost } from '../types';
import { authMiddleware } from '../middleware/auth';

const blog = new Hono<{ Bindings: Bindings }>();

// Public: Get all published posts
blog.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM blog_posts WHERE is_published = 1 ORDER BY published_at DESC'
    ).all<BlogPost>();
    
    return c.json({ posts: results });
  } catch (error) {
    console.error('Get blog posts error:', error);
    return c.json({ error: 'Erreur lors de la récupération des articles' }, 500);
  }
});

// Public: Get post by slug
blog.get('/:slug', async (c) => {
  try {
    const slug = c.req.param('slug');
    const post = await c.env.DB.prepare(
      'SELECT * FROM blog_posts WHERE slug = ? AND is_published = 1'
    ).bind(slug).first<BlogPost>();
    
    if (!post) {
      return c.json({ error: 'Article non trouvé' }, 404);
    }
    
    return c.json({ post });
  } catch (error) {
    console.error('Get blog post error:', error);
    return c.json({ error: 'Erreur lors de la récupération de l\'article' }, 500);
  }
});

// Protected routes
blog.use('/admin/*', authMiddleware);

// Admin: Get all posts
blog.get('/admin/all', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM blog_posts ORDER BY created_at DESC'
    ).all<BlogPost>();
    
    return c.json({ posts: results });
  } catch (error) {
    console.error('Get all blog posts error:', error);
    return c.json({ error: 'Erreur lors de la récupération des articles' }, 500);
  }
});

// Admin: Create post
blog.post('/admin', async (c) => {
  try {
    const data = await c.req.json<BlogPost>();
    
    if (!data.title || !data.slug || !data.content) {
      return c.json({ error: 'Titre, slug et contenu requis' }, 400);
    }
    
    const result = await c.env.DB.prepare(
      `INSERT INTO blog_posts (title, excerpt, content, author, category, image_url, 
       slug, is_published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      data.title,
      data.excerpt || null,
      data.content,
      data.author || null,
      data.category || null,
      data.image_url || null,
      data.slug,
      data.is_published ? 1 : 0,
      data.is_published ? new Date().toISOString() : null
    ).run();
    
    return c.json({
      success: true,
      post: {
        id: result.meta.last_row_id,
        ...data
      }
    }, 201);
  } catch (error) {
    console.error('Create blog post error:', error);
    return c.json({ error: 'Erreur lors de la création de l\'article' }, 500);
  }
});

// Admin: Update post
blog.put('/admin/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json<BlogPost>();
    
    const result = await c.env.DB.prepare(
      `UPDATE blog_posts SET title = ?, excerpt = ?, content = ?, author = ?, 
       category = ?, image_url = ?, slug = ?, is_published = ?, published_at = ?, 
       updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(
      data.title,
      data.excerpt || null,
      data.content,
      data.author || null,
      data.category || null,
      data.image_url || null,
      data.slug,
      data.is_published ? 1 : 0,
      data.is_published && !data.published_at ? new Date().toISOString() : data.published_at,
      id
    ).run();
    
    if (result.meta.changes === 0) {
      return c.json({ error: 'Article non trouvé' }, 404);
    }
    
    return c.json({ success: true, post: { id, ...data } });
  } catch (error) {
    console.error('Update blog post error:', error);
    return c.json({ error: 'Erreur lors de la mise à jour de l\'article' }, 500);
  }
});

// Admin: Delete post
blog.delete('/admin/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await c.env.DB.prepare(
      'DELETE FROM blog_posts WHERE id = ?'
    ).bind(id).run();
    
    if (result.meta.changes === 0) {
      return c.json({ error: 'Article non trouvé' }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete blog post error:', error);
    return c.json({ error: 'Erreur lors de la suppression de l\'article' }, 500);
  }
});

export default blog;
