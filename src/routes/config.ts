import { Hono } from 'hono';
import type { Bindings, SiteConfig, HeroSection } from '../types';
import { authMiddleware } from '../middleware/auth';

const config = new Hono<{ Bindings: Bindings }>();

// Public: Get all site config
config.get('/', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM site_config').all<SiteConfig>();
  const configObj: Record<string, any> = {};
  results.forEach(item => {
    configObj[item.key] = item.type === 'number' ? parseFloat(item.value) : item.value;
  });
  return c.json({ config: configObj });
});

// Public: Get hero section
config.get('/hero', async (c) => {
  const hero = await c.env.DB.prepare(
    'SELECT * FROM hero_section WHERE is_active = 1 LIMIT 1'
  ).first<HeroSection>();
  return c.json({ hero });
});

// Protected routes
config.use('/admin/*', authMiddleware);

// Admin: Update site config
config.put('/admin', async (c) => {
  const data = await c.req.json<Record<string, any>>();
  
  try {
    for (const [key, value] of Object.entries(data)) {
      const type = typeof value === 'number' ? 'number' : 'string';
      await c.env.DB.prepare(
        'INSERT OR REPLACE INTO site_config (key, value, type, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
      ).bind(key, String(value), type).run();
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Update config error:', error);
    return c.json({ error: 'Erreur lors de la mise à jour de la configuration' }, 500);
  }
});

// Admin: Update hero section
config.put('/admin/hero', async (c) => {
  const data = await c.req.json<HeroSection>();
  
  try {
    // Deactivate all hero sections first
    await c.env.DB.prepare('UPDATE hero_section SET is_active = 0').run();
    
    if (data.id) {
      // Update existing
      const result = await c.env.DB.prepare(
        'UPDATE hero_section SET title = ?, subtitle = ?, image_url = ?, cta_text = ?, cta_url = ?, is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(data.title, data.subtitle || null, data.image_url || null, data.cta_text || null, data.cta_url || null, data.id).run();
      
      if (result.meta.changes === 0) {
        return c.json({ error: 'Hero section non trouvée' }, 404);
      }
    } else {
      // Create new
      await c.env.DB.prepare(
        'INSERT INTO hero_section (title, subtitle, image_url, cta_text, cta_url, is_active) VALUES (?, ?, ?, ?, ?, 1)'
      ).bind(data.title, data.subtitle || null, data.image_url || null, data.cta_text || null, data.cta_url || null).run();
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Update hero error:', error);
    return c.json({ error: 'Erreur lors de la mise à jour de la hero section' }, 500);
  }
});

export default config;
