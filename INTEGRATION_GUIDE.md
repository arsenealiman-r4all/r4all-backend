# Guide d'intégration - Frontend Renergy4all

## 🎯 Objectif

Ce guide explique comment intégrer le backoffice Renergy4all avec votre site web statique existant pour rendre le contenu dynamique.

## 📋 Vue d'ensemble de l'architecture

```
┌─────────────────────────┐
│   Site Frontend         │
│   (index.html)          │
│   - HTML/CSS/JS         │
└───────────┬─────────────┘
            │
            │ API Calls
            │ (axios/fetch)
            ▼
┌─────────────────────────┐
│   Backoffice API        │
│   (Hono + Cloudflare)   │
│   - /api/services       │
│   - /api/projects       │
│   - /api/blog           │
│   - etc...              │
└───────────┬─────────────┘
            │
            │ SQL Queries
            ▼
┌─────────────────────────┐
│   Cloudflare D1         │
│   (SQLite Database)     │
└─────────────────────────┘
```

## 🔗 Étapes d'intégration

### 1. Remplacer le contenu statique par des appels API

Dans votre fichier `index.html`, ajoutez le code JavaScript suivant :

```html
<!-- À la fin de votre fichier HTML, avant </body> -->
<script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
<script>
  // Configuration de l'API
  const API_URL = 'https://votre-backoffice.pages.dev/api';
  
  // Fonction pour charger les données
  async function loadData() {
    try {
      // Charger les différentes sections
      const [services, projects, blog, config, hero, values] = await Promise.all([
        axios.get(`${API_URL}/services`),
        axios.get(`${API_URL}/projects`),
        axios.get(`${API_URL}/blog`),
        axios.get(`${API_URL}/config`),
        axios.get(`${API_URL}/config/hero`),
        axios.get(`${API_URL}/values`)
      ]);
      
      // Mettre à jour le DOM avec les données
      updateHeroSection(hero.data.hero);
      updateServices(services.data.services);
      updateProjects(projects.data.projects);
      updateBlog(blog.data.posts);
      updateValues(values.data.values);
      updateConfig(config.data.config);
      
    } catch (error) {
      console.error('Erreur de chargement:', error);
    }
  }
  
  // Fonctions pour mettre à jour chaque section
  function updateHeroSection(hero) {
    if (!hero) return;
    
    const heroTitle = document.querySelector('#hero-title');
    const heroSubtitle = document.querySelector('#hero-subtitle');
    const heroImage = document.querySelector('#hero-image');
    const heroCTA = document.querySelector('#hero-cta');
    
    if (heroTitle) heroTitle.textContent = hero.title;
    if (heroSubtitle) heroSubtitle.textContent = hero.subtitle;
    if (heroImage) heroImage.style.backgroundImage = `url(${hero.image_url})`;
    if (heroCTA) {
      heroCTA.textContent = hero.cta_text;
      heroCTA.href = hero.cta_url;
    }
  }
  
  function updateServices(services) {
    const servicesContainer = document.querySelector('#services-container');
    if (!servicesContainer) return;
    
    servicesContainer.innerHTML = services.map(service => `
      <div class="service-card">
        <div class="service-icon">
          <i class="${service.icon}"></i>
        </div>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
      </div>
    `).join('');
  }
  
  function updateProjects(projects) {
    const projectsContainer = document.querySelector('#projects-container');
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = projects.map(project => `
      <div class="project-card">
        ${project.image_url ? `<img src="${project.image_url}" alt="${project.title}">` : ''}
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <div class="project-meta">
          <span><i class="fas fa-map-marker-alt"></i> ${project.city}, ${project.country}</span>
          ${project.capacity_kw ? `<span><i class="fas fa-bolt"></i> ${project.capacity_kw} kW</span>` : ''}
        </div>
        <span class="project-status ${project.status}">${project.status === 'complete' ? 'Terminé' : 'En cours'}</span>
      </div>
    `).join('');
  }
  
  function updateBlog(posts) {
    const blogContainer = document.querySelector('#blog-container');
    if (!blogContainer) return;
    
    blogContainer.innerHTML = posts.slice(0, 3).map(post => `
      <article class="blog-post">
        ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}">` : ''}
        <div class="post-content">
          <span class="post-category">${post.category || 'Actualités'}</span>
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <div class="post-meta">
            <span><i class="fas fa-user"></i> ${post.author || 'Renergy4all'}</span>
            <span><i class="fas fa-calendar"></i> ${new Date(post.published_at).toLocaleDateString('fr-FR')}</span>
          </div>
          <a href="/blog/${post.slug}" class="read-more">Lire la suite →</a>
        </div>
      </article>
    `).join('');
  }
  
  function updateValues(values) {
    const valuesContainer = document.querySelector('#values-container');
    if (!valuesContainer) return;
    
    valuesContainer.innerHTML = values.map(value => `
      <div class="value-card">
        <div class="value-icon">
          <i class="${value.icon}"></i>
        </div>
        <h3>${value.title}</h3>
        ${value.subtitle ? `<h4>${value.subtitle}</h4>` : ''}
        <p>${value.description}</p>
      </div>
    `).join('');
  }
  
  function updateConfig(config) {
    // Mettre à jour les statistiques
    const statsElements = {
      yearsExperience: document.querySelector('#years-experience'),
      countriesCovered: document.querySelector('#countries-covered'),
      installationsCompleted: document.querySelector('#installations-completed')
    };
    
    if (statsElements.yearsExperience) 
      statsElements.yearsExperience.textContent = config.years_experience;
    if (statsElements.countriesCovered) 
      statsElements.countriesCovered.textContent = config.countries_covered;
    if (statsElements.installationsCompleted) 
      statsElements.installationsCompleted.textContent = config.installations_completed;
      
    // Mettre à jour les informations de contact
    const contactEmail = document.querySelector('#contact-email');
    const contactPhone = document.querySelector('#contact-phone');
    const contactAddress = document.querySelector('#contact-address');
    
    if (contactEmail) contactEmail.textContent = config.contact_email;
    if (contactPhone) contactPhone.textContent = config.contact_phone;
    if (contactAddress) contactAddress.textContent = config.contact_address;
  }
  
  // Charger les données au chargement de la page
  document.addEventListener('DOMContentLoaded', loadData);
</script>
```

### 2. Modifier le HTML pour inclure les ID nécessaires

Ajoutez les attributs `id` à vos sections existantes :

```html
<!-- Hero Section -->
<section id="hero" style="background-image: url()">
  <h1 id="hero-title">Titre par défaut</h1>
  <p id="hero-subtitle">Sous-titre par défaut</p>
  <a href="#" id="hero-cta" class="btn">CTA par défaut</a>
</section>

<!-- Services -->
<section id="services">
  <div id="services-container">
    <!-- Les services seront insérés ici dynamiquement -->
  </div>
</section>

<!-- Projets -->
<section id="projects">
  <div id="projects-container">
    <!-- Les projets seront insérés ici dynamiquement -->
  </div>
</section>

<!-- Blog -->
<section id="blog">
  <div id="blog-container">
    <!-- Les articles seront insérés ici dynamiquement -->
  </div>
</section>

<!-- Valeurs -->
<section id="values">
  <div id="values-container">
    <!-- Les valeurs seront insérées ici dynamiquement -->
  </div>
</section>

<!-- Statistiques -->
<section id="stats">
  <div class="stat">
    <span id="years-experience">10</span>
    <p>Années d'expérience</p>
  </div>
  <div class="stat">
    <span id="countries-covered">12</span>
    <p>Pays couverts</p>
  </div>
  <div class="stat">
    <span id="installations-completed">500</span>
    <p>Installations</p>
  </div>
</section>

<!-- Contact -->
<section id="contact">
  <p><i class="fas fa-envelope"></i> <span id="contact-email">contact@renergy4all.com</span></p>
  <p><i class="fas fa-phone"></i> <span id="contact-phone">+225 XX XX XX XX</span></p>
  <p><i class="fas fa-map-marker-alt"></i> <span id="contact-address">Abidjan, Côte d'Ivoire</span></p>
</section>
```

### 3. Formulaire de contact

Connectez votre formulaire de contact à l'API :

```html
<form id="contact-form">
  <input type="text" name="name" placeholder="Nom" required>
  <input type="email" name="email" placeholder="Email" required>
  <input type="tel" name="phone" placeholder="Téléphone">
  <input type="text" name="subject" placeholder="Sujet">
  <textarea name="message" placeholder="Message" required></textarea>
  <button type="submit">Envoyer</button>
</form>

<script>
  document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };
    
    try {
      const response = await axios.post(`${API_URL}/contact`, data);
      
      if (response.data.success) {
        alert('Message envoyé avec succès !');
        e.target.reset();
      }
    } catch (error) {
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
      console.error(error);
    }
  });
</script>
```

### 4. Affichage d'un article de blog complet

Pour une page d'article individuel (`/blog/:slug`) :

```html
<div id="blog-post"></div>

<script>
  async function loadBlogPost() {
    // Récupérer le slug depuis l'URL
    const slug = window.location.pathname.split('/').pop();
    
    try {
      const response = await axios.get(`${API_URL}/blog/${slug}`);
      const post = response.data.post;
      
      document.getElementById('blog-post').innerHTML = `
        <article>
          ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}">` : ''}
          <h1>${post.title}</h1>
          <div class="post-meta">
            <span><i class="fas fa-user"></i> ${post.author || 'Renergy4all'}</span>
            <span><i class="fas fa-calendar"></i> ${new Date(post.published_at).toLocaleDateString('fr-FR')}</span>
            <span><i class="fas fa-tag"></i> ${post.category || 'Actualités'}</span>
          </div>
          <div class="post-content">
            ${post.content.replace(/\n/g, '<br>')}
          </div>
        </article>
      `;
      
      document.title = `${post.title} - Renergy4all`;
    } catch (error) {
      document.getElementById('blog-post').innerHTML = `
        <div class="error">
          <h2>Article non trouvé</h2>
          <p>L'article que vous recherchez n'existe pas.</p>
          <a href="/">Retour à l'accueil</a>
        </div>
      `;
    }
  }
  
  document.addEventListener('DOMContentLoaded', loadBlogPost);
</script>
```

## 🎨 CSS pour le chargement

Ajoutez un loader pendant le chargement des données :

```css
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.loading::after {
  content: "";
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

```html
<div id="services-container" class="loading"></div>

<script>
  async function updateServices(services) {
    const container = document.querySelector('#services-container');
    container.classList.remove('loading'); // Retirer le loader
    // ... reste du code
  }
</script>
```

## 🔄 Mise en cache (optionnel)

Pour améliorer les performances, utilisez le localStorage :

```javascript
async function loadDataWithCache() {
  const CACHE_KEY = 'renergy_data';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  // Vérifier le cache
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      // Utiliser les données en cache
      updateAllSections(data);
      return;
    }
  }
  
  // Charger les nouvelles données
  try {
    const [services, projects, blog, config, hero, values] = await Promise.all([
      axios.get(`${API_URL}/services`),
      axios.get(`${API_URL}/projects`),
      axios.get(`${API_URL}/blog`),
      axios.get(`${API_URL}/config`),
      axios.get(`${API_URL}/config/hero`),
      axios.get(`${API_URL}/values`)
    ]);
    
    const data = {
      services: services.data.services,
      projects: projects.data.projects,
      blog: blog.data.posts,
      config: config.data.config,
      hero: hero.data.hero,
      values: values.data.values
    };
    
    // Sauvegarder dans le cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
    
    updateAllSections(data);
    
  } catch (error) {
    console.error('Erreur de chargement:', error);
  }
}
```

## 🚀 Déploiement

### Option 1 : Hébergement statique (Cloudflare Pages, Netlify, Vercel)

1. Mettez votre site statique sur GitHub
2. Connectez votre repo à Cloudflare Pages/Netlify/Vercel
3. Configurez l'URL de l'API dans votre code
4. Déployez !

### Option 2 : Hébergement classique

1. Uploadez vos fichiers HTML/CSS/JS sur votre serveur
2. Configurez l'URL de l'API
3. Assurez-vous que CORS est activé sur l'API (déjà configuré)

## 🔒 Sécurité et CORS

L'API backoffice est configurée avec CORS pour accepter les requêtes de n'importe quelle origine :

```javascript
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

Pour plus de sécurité en production, vous pouvez restreindre l'origine :

```javascript
app.use('/api/*', cors({
  origin: 'https://votre-site.com',
  // ... reste de la config
}));
```

## 📊 Monitoring et Analytics

Ajoutez un tracking des erreurs :

```javascript
async function loadData() {
  try {
    // ... votre code
  } catch (error) {
    console.error('Erreur de chargement:', error);
    
    // Envoyer à votre système d'analytics
    if (window.gtag) {
      gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }
    
    // Afficher un message à l'utilisateur
    showErrorMessage('Impossible de charger le contenu. Veuillez rafraîchir la page.');
  }
}
```

## 🎯 Exemple complet

Voir le fichier `example-integration.html` pour un exemple complet d'intégration.

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez que l'API est accessible : `curl https://votre-api.pages.dev/api/health`
2. Vérifiez la console du navigateur pour les erreurs
3. Vérifiez que CORS est correctement configuré
4. Testez avec Postman ou curl avant d'intégrer au frontend

## 🔗 Ressources

- [Documentation API complète](./README.md)
- [Exemples d'intégration](./examples/)
- [Guide de déploiement](./DEPLOYMENT.md)

---

**Dernière mise à jour** : 31 octobre 2025
