-- Insérer un utilisateur admin par défaut
-- Email: admin@renergy4all.com
-- Password: admin123 (hash SHA-256)
INSERT OR IGNORE INTO users (email, password, name, role) VALUES 
  ('admin@renergy4all.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Administrateur', 'admin');

-- Configuration globale du site
INSERT OR IGNORE INTO site_config (key, value, type) VALUES 
  ('site_name', 'Renergy4all', 'string'),
  ('site_tagline', 'Énergie Solaire pour une Afrique Prospère', 'string'),
  ('contact_email', 'contact@renergy4all.com', 'string'),
  ('contact_phone', '+225 XX XX XX XX XX', 'string'),
  ('contact_address', 'Abidjan, Côte d''Ivoire', 'string'),
  ('years_experience', '10', 'number'),
  ('countries_covered', '12', 'number'),
  ('installations_completed', '500', 'number');

-- Hero Section par défaut
INSERT OR IGNORE INTO hero_section (title, subtitle, image_url, cta_text, cta_url) VALUES 
  (
    'Renergy4all - Énergie Solaire pour une Afrique Prospère',
    'Solutions d''énergie solaire propre et abordable pour transformer l''Afrique',
    '/static/images/hero-bg.jpg',
    'Découvrir nos solutions',
    '#services'
  );

-- Services par défaut
INSERT OR IGNORE INTO services (title, description, icon, order_index) VALUES 
  (
    'Installation Solaire Résidentielle',
    'Des solutions sur mesure pour alimenter votre maison en énergie propre et économique',
    'fa-home',
    1
  ),
  (
    'Solutions Commerciales',
    'Réduisez vos coûts énergétiques avec nos systèmes solaires pour entreprises',
    'fa-building',
    2
  ),
  (
    'Projets Industriels',
    'Solutions à grande échelle pour vos installations industrielles',
    'fa-industry',
    3
  ),
  (
    'Maintenance & Support',
    'Service après-vente et maintenance pour garantir la performance optimale',
    'fa-wrench',
    4
  );

-- Projets exemples
INSERT OR IGNORE INTO projects (title, summary, country, city, status, capacity_kw, beneficiaries, order_index) VALUES 
  (
    'Électrification Village Korhogo',
    'Installation de panneaux solaires pour 200 foyers',
    'Côte d''Ivoire',
    'Korhogo',
    'complete',
    150.5,
    200,
    1
  ),
  (
    'Centre Médical Yamoussoukro',
    'Alimentation solaire complète d''un centre de santé',
    'Côte d''Ivoire',
    'Yamoussoukro',
    'en_cours',
    75.0,
    1,
    2
  );

-- Valeurs de l'entreprise
INSERT OR IGNORE INTO company_values (title, subtitle, description, icon, order_index) VALUES 
  (
    'Intégrité',
    'Integrity',
    'Nous opérons avec transparence et honnêteté dans toutes nos interactions',
    'fa-handshake',
    1
  ),
  (
    'Excellence',
    'Excellence',
    'Nous visons l''excellence dans chaque projet et service fourni',
    'fa-star',
    2
  ),
  (
    'Engagement Communautaire',
    'Community Engagement',
    'Nous travaillons main dans la main avec les communautés locales',
    'fa-users',
    3
  );

-- Partenaires exemples
INSERT OR IGNORE INTO partners (name, type, description, order_index) VALUES 
  (
    'Partenaire Commercial 1',
    'commercial',
    'Leader dans la distribution d''équipements solaires',
    1
  ),
  (
    'Partenaire Technique 1',
    'technique',
    'Expert en ingénierie solaire',
    1
  ),
  (
    'Partenaire Financier 1',
    'financier',
    'Institution financière pour le financement de projets',
    1
  );

-- Formations de l'académie
INSERT OR IGNORE INTO courses (title, description, duration, price, certification, order_index) VALUES 
  (
    'Installation de Panneaux Solaires',
    'Formation complète sur l''installation de systèmes photovoltaïques',
    '5 jours',
    500000,
    1,
    1
  ),
  (
    'Maintenance des Systèmes Solaires',
    'Apprenez à maintenir et réparer les installations solaires',
    '3 jours',
    300000,
    1,
    2
  );
