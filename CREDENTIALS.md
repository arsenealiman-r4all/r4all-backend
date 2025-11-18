# 🔐 Identifiants de connexion - Renergy4all Backoffice

## ✅ Identifiants actifs

### Compte Administrateur
- **Email** : `admin@renergy4all.com`
- **Mot de passe** : `admin123`

## 🌐 URLs d'accès

### Environnement Sandbox (Actuel)
- **Dashboard** : https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai
- **Page de connexion** : https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai/login
- **API** : https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai/api

## 📝 Instructions de connexion

1. Accédez à la page de connexion : https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai/login

2. Entrez les identifiants :
   ```
   Email : admin@renergy4all.com
   Mot de passe : admin123
   ```

3. Cliquez sur "Se connecter"

4. Vous serez redirigé vers le tableau de bord

## 🔒 Sécurité

### ⚠️ IMPORTANT - Pour la production

Une fois déployé en production, **changez immédiatement le mot de passe** :

#### Option 1 : Via la base de données
```bash
# Générer un nouveau hash
node fix-password.js

# Mettre à jour en production
npx wrangler d1 execute renergy-backoffice-db --command="UPDATE users SET password='NOUVEAU_HASH' WHERE email='admin@renergy4all.com';"
```

#### Option 2 : Créer un nouvel utilisateur
```bash
# Via l'API (nécessite d'être connecté en tant qu'admin)
curl -X POST https://votre-backoffice.pages.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Cookie: session_id=VOTRE_SESSION_ID" \
  -d '{
    "email": "nouveau@email.com",
    "password": "nouveau_mot_de_passe",
    "name": "Nom Admin",
    "role": "admin"
  }'
```

## 🔑 Générer un hash de mot de passe

Pour créer un nouveau mot de passe hashé :

```bash
cd /home/user/webapp
node fix-password.js
# Modifiez le mot de passe dans le fichier avant d'exécuter
```

Le script affichera :
- Le mot de passe en clair
- Le hash SHA-256
- La commande SQL pour mettre à jour

## 🛠️ Résolution de problèmes

### Impossible de se connecter ?

1. **Vérifier que le serveur est actif** :
   ```bash
   curl https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai/api/health
   ```

2. **Vérifier l'utilisateur dans la base de données** :
   ```bash
   cd /home/user/webapp
   npx wrangler d1 execute renergy-backoffice-db --local --command="SELECT email, name FROM users;"
   ```

3. **Réinitialiser le mot de passe** :
   ```bash
   cd /home/user/webapp
   npx wrangler d1 execute renergy-backoffice-db --local --command="UPDATE users SET password='240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9' WHERE email='admin@renergy4all.com';"
   ```

4. **Vérifier les logs** :
   ```bash
   pm2 logs renergy-backoffice --nostream
   ```

### Session expirée ?

Les sessions expirent après **24 heures**. Reconnectez-vous simplement.

### Cookie bloqué ?

Si vous utilisez un bloqueur de cookies ou un mode incognito strict, les sessions peuvent ne pas fonctionner. Essayez dans un navigateur standard.

## 📞 Support

Si vous rencontrez des problèmes persistants :

1. Vérifiez la console du navigateur (F12) pour les erreurs JavaScript
2. Vérifiez les logs du serveur : `pm2 logs renergy-backoffice`
3. Testez l'API directement avec curl ou Postman
4. Vérifiez que votre navigateur accepte les cookies

## 🔐 Hash actuel (pour référence)

```
Mot de passe : admin123
Hash SHA-256 : 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
```

**Note** : Ce hash est spécifique à l'algorithme SHA-256 utilisé dans l'application. Ne pas confondre avec bcrypt ou d'autres algorithmes de hachage.

---

**Dernière mise à jour** : 31 octobre 2025  
**Statut** : ✅ Identifiants vérifiés et fonctionnels
