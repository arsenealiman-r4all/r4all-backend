# 🚀 Guide de démarrage rapide - Renergy4all Backoffice

## ✅ Le backoffice est maintenant fonctionnel !

### 🔐 Connexion immédiate

**URL** : https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai/login

**Identifiants** :
- **Email** : `admin@renergy4all.com`
- **Mot de passe** : `admin123`

> ⚠️ **Le problème de connexion a été résolu !** Vous pouvez maintenant vous connecter sans problème.

---

## 📋 Que pouvez-vous faire maintenant ?

### 1. **Gérer les Services** 🛠️
- Ajouter, modifier, supprimer des services
- Personnaliser les icônes (Font Awesome)
- Gérer l'ordre d'affichage

### 2. **Gérer les Projets** 📊
- Créer vos projets en cours et terminés
- Ajouter localisation, capacité, bénéficiaires
- Uploader des images de projets

### 3. **Publier des Articles** 📝
- Rédiger des articles de blog
- Gérer brouillons et publications
- Organiser par catégories

### 4. **Organiser des Événements** 📅
- Créer des événements
- Ajouter dates et liens d'inscription
- Gérer les visuels

### 5. **Gérer les Partenaires** 🤝
- Ajouter partenaires commerciaux, techniques, financiers
- Uploader logos
- Liens vers sites web

### 6. **Formations de l'Académie** 🎓
- Créer des formations
- Définir prix et durée
- Gérer les certifications

### 7. **Définir vos Valeurs** ⭐
- Ajouter les valeurs de l'entreprise
- Personnaliser icônes et descriptions

### 8. **Consulter les Messages** 📧
- Voir les messages de contact
- Marquer comme lu
- Gérer les demandes

### 9. **Configurer le Site** ⚙️
- Modifier la Hero Section
- Mettre à jour statistiques
- Gérer informations de contact

---

## 🎯 Navigation dans le backoffice

### Menu principal (sidebar gauche)
```
📊 Tableau de bord  → Vue d'ensemble
🖼️ Hero Section     → Bannière principale
🛠️ Services         → Vos services
📁 Projets          → Vos projets
📝 Blog             → Articles
📅 Événements       → Events
🤝 Partenaires      → Partners
🎓 Académie         → Formations
⭐ Valeurs          → Company values
📧 Messages         → Contact messages
⚙️ Configuration    → Site settings
```

---

## 💡 Exemples d'utilisation

### Ajouter un nouveau service

1. Cliquez sur **"Services"** dans le menu
2. Cliquez sur **"Ajouter un service"**
3. Remplissez le formulaire :
   - **Titre** : "Installation Solaire Industrielle"
   - **Description** : "Solutions à grande échelle..."
   - **Icône** : "fa-industry"
   - **Ordre** : 5
4. Cochez **"Service actif"**
5. Cliquez sur **"Créer"**

✅ Votre service apparaît maintenant sur l'API publique !

### Publier un article de blog

1. Cliquez sur **"Blog"** dans le menu
2. Cliquez sur **"Nouvel article"**
3. Remplissez :
   - **Titre** : "Nouvelle installation à Yamoussoukro"
   - **Slug** : "nouvelle-installation-yamoussoukro"
   - **Catégorie** : "Actualités"
   - **Auteur** : "Renergy4all"
   - **Contenu** : Votre texte complet
4. Cochez **"Publier l'article"**
5. Cliquez sur **"Publier"**

✅ L'article est maintenant visible sur votre site !

### Créer un projet

1. Cliquez sur **"Projets"**
2. Cliquez sur **"Ajouter un projet"**
3. Complétez :
   - **Titre** : "Électrification Village Korhogo"
   - **Pays** : "Côte d'Ivoire"
   - **Ville** : "Korhogo"
   - **Statut** : "En cours"
   - **Capacité** : 150.5 kW
   - **Bénéficiaires** : 200
4. Cliquez sur **"Créer"**

✅ Le projet apparaît dans la liste publique !

---

## 🔗 Intégration avec votre site

### Étape 1 : Télécharger l'exemple
Téléchargez le fichier `example-integration.html`

### Étape 2 : Configurer l'API
Dans le fichier, remplacez :
```javascript
const API_URL = 'http://localhost:3000/api';
```
par :
```javascript
const API_URL = 'https://votre-backoffice.pages.dev/api';
```

### Étape 3 : Adapter à votre design
Le fichier contient tous les appels API nécessaires. Adaptez simplement le HTML/CSS à votre design existant.

### Étape 4 : Déployer
Uploadez votre site et c'est terminé !

---

## 📊 API disponible

### Endpoints publics (sans authentification)

```bash
# Services
GET https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai/api/services

# Projets
GET https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai/api/projects

# Blog
GET https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai/api/blog

# Configuration
GET https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai/api/config

# Hero Section
GET https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai/api/config/hero

# Envoyer un message
POST https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai/api/contact
```

### Test rapide de l'API

```bash
# Récupérer les services
curl https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai/api/services | jq

# Récupérer les projets
curl https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai/api/projects | jq

# Récupérer la configuration
curl https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai/api/config | jq
```

---

## 🎨 Personnalisation

### Changer le logo
Dans le fichier `src/index.tsx`, modifiez :
```javascript
<h1 class="text-2xl font-bold text-purple-600">Renergy4all</h1>
```

### Changer les couleurs
Le backoffice utilise un dégradé purple-indigo. Pour changer :
- Éditez le fichier `src/index.tsx`
- Remplacez `from-purple-600 to-indigo-600` par vos couleurs

### Ajouter un logo
1. Placez votre logo dans `public/static/`
2. Modifiez le HTML dans `src/index.tsx`

---

## 📚 Documentation complète

- **README.md** : Documentation technique complète
- **INTEGRATION_GUIDE.md** : Guide d'intégration frontend
- **CREDENTIALS.md** : Informations de connexion
- **example-integration.html** : Exemple d'intégration complet

---

## 🆘 Besoin d'aide ?

### Problèmes de connexion
✅ **Résolu !** Utilisez : `admin@renergy4all.com` / `admin123`

### Le serveur ne répond pas
```bash
pm2 list
pm2 restart renergy-backoffice
```

### Erreurs dans l'API
```bash
pm2 logs renergy-backoffice --nostream
```

### Réinitialiser la base de données
```bash
cd /home/user/webapp
npm run db:reset
```

---

## 🚀 Déploiement en production

Quand vous serez prêt à déployer en production sur Cloudflare Pages :

```bash
# 1. Se connecter à Cloudflare
npx wrangler login

# 2. Créer la base de données
npx wrangler d1 create renergy-backoffice-db

# 3. Mettre à jour wrangler.jsonc avec le database_id

# 4. Appliquer les migrations
npm run db:migrate:prod

# 5. Déployer
npm run deploy
```

---

## ✨ C'est parti !

**Connectez-vous maintenant** : https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai/login

**Email** : `admin@renergy4all.com`  
**Mot de passe** : `admin123`

---

**Dernière mise à jour** : 31 octobre 2025  
**Statut** : ✅ Opérationnel et testé
