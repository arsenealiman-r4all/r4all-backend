# Renergy4all - Backoffice Administration

## 🎯 Vue d'ensemble du projet

**Nom**: Renergy4all Backoffice  
**Objectif**: Plateforme d'administration complète pour gérer le contenu du site web Renergy4all  
**Technologies**: Hono + TypeScript + Cloudflare D1 + Tailwind CSS

## 🌐 URLs

### Environnement de développement (Sandbox)
- **Application**: https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai
- **Page de connexion**: https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai/login
- **API Health Check**: https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai/api/health

### Identifiants de test
- **Email**: admin@renergy4all.com
- **Mot de passe**: admin123

## ✅ Fonctionnalités complétées

### 1. Authentification et sécurité
- ✅ Système de connexion/déconnexion sécurisé
- ✅ Gestion des sessions avec cookies HTTP-only
- ✅ Protection des routes admin par middleware
- ✅ Hashage des mots de passe (SHA-256)

### 2. Gestion des Services
- ✅ Création, modification, suppression de services
- ✅ Icônes Font Awesome personnalisables
- ✅ Gestion de l'ordre d'affichage
- ✅ Activation/désactivation des services

### 3. Gestion des Projets
- ✅ CRUD complet des projets
- ✅ Gestion des statuts (en cours, terminé, planifié)
- ✅ Informations détaillées : localisation, capacité kW, bénéficiaires
- ✅ Support des images de projet

### 4. Blog
- ✅ Création et modification d'articles
- ✅ Gestion des brouillons et publications
- ✅ Catégorisation des articles
- ✅ Gestion des slugs pour URLs SEO-friendly
- ✅ Support des images d'en-tête

### 5. Événements
- ✅ Gestion complète des événements
- ✅ Dates et localisations
- ✅ Liens d'inscription
- ✅ Images d'événements

### 6. Partenaires
- ✅ Gestion des partenaires par type (commercial, technique, financier)
- ✅ Logos et liens de sites web
- ✅ Ordre d'affichage personnalisable

### 7. Académie (Formations)
- ✅ Catalogue de formations
- ✅ Gestion des prix et durées
- ✅ Certifications
- ✅ Liens d'inscription

### 8. Valeurs d'entreprise
- ✅ Gestion des valeurs
- ✅ Icônes et descriptions
- ✅ Support multilingue (titre/sous-titre)

### 9. Messages de contact
- ✅ Réception et visualisation des messages
- ✅ Marquage comme lu/non lu
- ✅ Compteur de messages non lus
- ✅ Suppression de messages

### 10. Configuration du site
- ✅ Hero section (bannière principale)
- ✅ Configuration globale du site
- ✅ Statistiques et KPIs

## 📊 Structure de données

### Base de données Cloudflare D1
Le backoffice utilise une base de données SQLite (D1) avec les tables suivantes :

| Table | Description |
|-------|-------------|
| `users` | Utilisateurs admin |
| `site_config` | Configuration globale |
| `hero_section` | Bannière principale |
| `services` | Services offerts |
| `projects` | Projets réalisés/en cours |
| `blog_posts` | Articles de blog |
| `events` | Événements |
| `partners` | Partenaires |
| `courses` | Formations académie |
| `company_values` | Valeurs d'entreprise |
| `contact_messages` | Messages de contact |
| `sessions` | Sessions utilisateurs |

## 🚀 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/check` - Vérifier la session
- `POST /api/auth/register` - Créer un utilisateur (admin seulement)

### Services
- `GET /api/services` - Liste des services actifs (public)
- `GET /api/services/admin/all` - Tous les services (admin)
- `POST /api/services/admin` - Créer un service (admin)
- `PUT /api/services/admin/:id` - Modifier un service (admin)
- `DELETE /api/services/admin/:id` - Supprimer un service (admin)

### Projets
- `GET /api/projects` - Liste des projets actifs (public)
- `GET /api/projects/admin/all` - Tous les projets (admin)
- `POST /api/projects/admin` - Créer un projet (admin)
- `PUT /api/projects/admin/:id` - Modifier un projet (admin)
- `DELETE /api/projects/admin/:id` - Supprimer un projet (admin)

### Blog
- `GET /api/blog` - Articles publiés (public)
- `GET /api/blog/:slug` - Article par slug (public)
- `GET /api/blog/admin/all` - Tous les articles (admin)
- `POST /api/blog/admin` - Créer un article (admin)
- `PUT /api/blog/admin/:id` - Modifier un article (admin)
- `DELETE /api/blog/admin/:id` - Supprimer un article (admin)

### Événements
- `GET /api/events` - Événements actifs (public)
- `GET /api/events/admin/all` - Tous les événements (admin)
- `POST /api/events/admin` - Créer un événement (admin)
- `PUT /api/events/admin/:id` - Modifier un événement (admin)
- `DELETE /api/events/admin/:id` - Supprimer un événement (admin)

### Partenaires
- `GET /api/partners` - Partenaires actifs (public)
- `GET /api/partners/:type` - Partenaires par type (public)
- `GET /api/partners/admin/all` - Tous les partenaires (admin)
- `POST /api/partners/admin` - Créer un partenaire (admin)
- `PUT /api/partners/admin/:id` - Modifier un partenaire (admin)
- `DELETE /api/partners/admin/:id` - Supprimer un partenaire (admin)

### Formations
- `GET /api/courses` - Formations actives (public)
- `GET /api/courses/admin/all` - Toutes les formations (admin)
- `POST /api/courses/admin` - Créer une formation (admin)
- `PUT /api/courses/admin/:id` - Modifier une formation (admin)
- `DELETE /api/courses/admin/:id` - Supprimer une formation (admin)

### Valeurs
- `GET /api/values` - Valeurs actives (public)
- `GET /api/values/admin/all` - Toutes les valeurs (admin)
- `POST /api/values/admin` - Créer une valeur (admin)
- `PUT /api/values/admin/:id` - Modifier une valeur (admin)
- `DELETE /api/values/admin/:id` - Supprimer une valeur (admin)

### Contact
- `POST /api/contact` - Envoyer un message (public)
- `GET /api/contact/admin/all` - Tous les messages (admin)
- `GET /api/contact/admin/unread-count` - Nombre de messages non lus (admin)
- `PUT /api/contact/admin/:id/read` - Marquer comme lu (admin)
- `DELETE /api/contact/admin/:id` - Supprimer un message (admin)

### Configuration
- `GET /api/config` - Configuration du site (public)
- `GET /api/config/hero` - Hero section (public)
- `PUT /api/config/admin` - Modifier la configuration (admin)
- `PUT /api/config/admin/hero` - Modifier la hero section (admin)

## 📖 Guide d'utilisation

### 1. Connexion
1. Accédez à `/login`
2. Utilisez les identifiants : `admin@renergy4all.com` / `admin123`
3. Vous serez redirigé vers le tableau de bord

### 2. Tableau de bord
- Visualisez les statistiques en temps réel
- Accédez rapidement aux actions principales
- Naviguez vers les différentes sections via le menu latéral

### 3. Gestion des contenus
Chaque section permet de :
- **Voir** : Liste complète des éléments
- **Créer** : Bouton "Ajouter" en haut de page
- **Modifier** : Bouton "Modifier" sur chaque élément
- **Supprimer** : Bouton "Supprimer" avec confirmation

### 4. Formulaires
- Les champs marqués d'un `*` sont obligatoires
- Les modifications sont sauvegardées instantanément
- Un message de confirmation s'affiche après chaque action

## 🛠️ Développement local

### Prérequis
- Node.js 18+
- npm ou pnpm

### Installation
```bash
# Cloner le projet
git clone <repo-url>
cd webapp

# Installer les dépendances
npm install

# Appliquer les migrations
npm run db:migrate:local

# Créer un utilisateur admin
npx wrangler d1 execute renergy-backoffice-db --local --command="DELETE FROM users; INSERT INTO users (email, password, name, role) VALUES ('admin@renergy4all.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Administrateur', 'admin');"

# Build du projet
npm run build

# Démarrer en développement (sandbox)
pm2 start ecosystem.config.cjs
```

### Scripts disponibles
```bash
npm run dev              # Vite dev server
npm run dev:sandbox      # Wrangler local dev avec D1
npm run build            # Build production
npm run preview          # Preview du build
npm run deploy           # Déployer sur Cloudflare Pages
npm run db:migrate:local # Appliquer migrations locales
npm run db:migrate:prod  # Appliquer migrations production
npm run db:reset         # Réinitialiser la DB locale
npm run clean-port       # Nettoyer le port 3000
npm run test             # Tester avec curl
```

## 🚀 Déploiement sur Cloudflare Pages

### Étape 1 : Configuration Cloudflare
```bash
# Se connecter à Cloudflare
npx wrangler login

# Créer la base de données D1 en production
npx wrangler d1 create renergy-backoffice-db

# Copier le database_id dans wrangler.jsonc
```

### Étape 2 : Créer le projet Pages
```bash
npx wrangler pages project create renergy-backoffice \
  --production-branch main \
  --compatibility-date 2025-10-31
```

### Étape 3 : Appliquer les migrations
```bash
npm run db:migrate:prod
```

### Étape 4 : Créer l'utilisateur admin en production
```bash
npx wrangler d1 execute renergy-backoffice-db --command="INSERT INTO users (email, password, name, role) VALUES ('admin@renergy4all.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Administrateur', 'admin');"
```

### Étape 5 : Déployer
```bash
npm run deploy
```

## 🔒 Sécurité

### Recommandations pour la production
1. **Changez le mot de passe admin** immédiatement après le premier déploiement
2. **Utilisez HTTPS** uniquement (configuré automatiquement sur Cloudflare)
3. **Activez 2FA** sur votre compte Cloudflare
4. **Limitez les accès** : créez des rôles si nécessaire
5. **Surveillez les logs** régulièrement

### Changer le mot de passe admin
```bash
# Générer un nouveau hash (remplacez 'nouveau_mot_de_passe')
echo -n 'nouveau_mot_de_passe' | sha256sum

# Mettre à jour en production
npx wrangler d1 execute renergy-backoffice-db --command="UPDATE users SET password='VOTRE_HASH' WHERE email='admin@renergy4all.com';"
```

## 📝 Statut de déploiement

- ✅ **Sandbox**: Actif - https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai
- ❌ **Production**: Non déployé (nécessite configuration Cloudflare API)

### Pour déployer en production
1. Configurer votre token Cloudflare API
2. Créer la base de données D1
3. Mettre à jour `wrangler.jsonc` avec le `database_id`
4. Exécuter `npm run deploy`

## 🛣️ Prochaines étapes recommandées

### Fonctionnalités à ajouter
1. **Upload d'images** : Intégration avec Cloudflare R2 pour le stockage
2. **Éditeur WYSIWYG** : Pour le contenu des articles de blog
3. **Galerie photos** : Gestion des images pour la galerie du site
4. **Statistiques avancées** : Analytics et rapports détaillés
5. **Export de données** : Export CSV/Excel des différentes sections
6. **Multi-utilisateurs** : Gestion des rôles et permissions
7. **Notifications email** : Alertes pour les nouveaux messages
8. **Historique des modifications** : Audit trail complet
9. **Prévisualisation** : Voir les changements avant publication
10. **API publique** : Pour alimenter le site frontend

### Améliorations techniques
1. Ajouter des tests unitaires et d'intégration
2. Mettre en place un système de cache
3. Optimiser les requêtes de base de données
4. Ajouter la pagination pour les listes longues
5. Implémenter la recherche et le filtrage
6. Ajouter la validation côté serveur avec Zod
7. Mettre en place un système de backup automatique

## 📊 Architecture technique

```
webapp/
├── src/
│   ├── index.tsx           # Point d'entrée Hono
│   ├── types/              # Définitions TypeScript
│   ├── routes/             # Routes API
│   │   ├── auth.ts         # Authentification
│   │   ├── services.ts     # Services
│   │   ├── projects.ts     # Projets
│   │   ├── blog.ts         # Blog
│   │   ├── events.ts       # Événements
│   │   ├── partners.ts     # Partenaires
│   │   ├── courses.ts      # Formations
│   │   ├── values.ts       # Valeurs
│   │   ├── contact.ts      # Messages
│   │   └── config.ts       # Configuration
│   ├── middleware/         # Middlewares
│   │   └── auth.ts         # Authentification
│   └── utils/              # Utilitaires
│       └── auth.ts         # Fonctions d'auth
├── public/static/          # Fichiers statiques
│   ├── admin.js            # Frontend dashboard
│   └── login.js            # Frontend login
├── migrations/             # Migrations D1
│   ├── 0001_initial_schema.sql
│   └── 0002_seed_data.sql
├── wrangler.jsonc          # Configuration Cloudflare
├── package.json            # Dépendances
├── vite.config.ts          # Configuration Vite
├── tsconfig.json           # Configuration TypeScript
└── ecosystem.config.cjs    # Configuration PM2
```

## 🤝 Support

Pour toute question ou problème :
1. Vérifiez les logs : `pm2 logs renergy-backoffice --nostream`
2. Testez l'API : `curl http://localhost:3000/api/health`
3. Vérifiez la base de données : `npm run db:console:local`

## 📄 Licence

Ce projet est propriétaire de Renergy4all.

---

**Dernière mise à jour** : 31 octobre 2025  
**Version** : 1.0.0  
**Stack** : Hono + TypeScript + Cloudflare D1 + Tailwind CSS
