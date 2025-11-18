# 🔧 Correctifs appliqués - Renergy4all Backoffice

## ✅ Problèmes résolus

### 1. ❌ Problème : Impossible de se connecter (hash de mot de passe incorrect)

**Symptôme** : 
- Lors de la tentative de connexion avec `admin@renergy4all.com` / `admin123`
- Message d'erreur : "Email ou mot de passe incorrect"

**Cause** :
- Le hash du mot de passe dans la base de données était incorrect
- Le hash initial utilisait un format bcrypt incorrect

**Solution appliquée** :
1. Créé un script `fix-password.js` pour générer le hash SHA-256 correct
2. Généré le bon hash : `240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9`
3. Mis à jour la base de données locale avec le bon hash
4. Corrigé le fichier de migration `0002_seed_data.sql` pour les futurs déploiements

**Commit** : `fix: Correct password hash for admin user and add credentials documentation`

**Vérification** :
```bash
# Test de connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@renergy4all.com","password":"admin123"}'

# Résultat attendu : {"success":true,...}
```

---

### 2. ❌ Problème : Éjection après connexion (cookies non persistants)

**Symptôme** :
- Connexion réussie (authentification OK)
- Redirection vers le dashboard
- Immédiatement redirigé vers la page de connexion
- Session ne persiste pas

**Cause racine** :
Le cookie était configuré avec le flag `Secure`, qui nécessite HTTPS :

```javascript
'Set-Cookie': `session_id=${sessionId}; HttpOnly; Secure; SameSite=Strict; ...`
```

En développement local (HTTP), le navigateur **refuse de stocker** les cookies avec le flag `Secure`.

**Problèmes identifiés** :
1. **Flag Secure en HTTP** : Le flag `Secure` empêche le cookie de fonctionner en HTTP
2. **SameSite=Strict** : Trop restrictif, bloque même les redirections internes

**Solution appliquée** :

#### Détection automatique du protocole
```javascript
// Dans src/routes/auth.ts
const protocol = c.req.header('x-forwarded-proto') || 'http';
const isSecure = protocol === 'https';
const secureFlag = isSecure ? 'Secure; ' : '';
```

#### Configuration adaptative du cookie
```javascript
// Login
'Set-Cookie': `session_id=${sessionId}; HttpOnly; ${secureFlag}SameSite=Lax; Max-Age=86400; Path=/`

// Logout
'Set-Cookie': `session_id=; HttpOnly; ${secureFlag}SameSite=Lax; Max-Age=0; Path=/`
```

**Changements** :
- ✅ `Secure` → Appliqué uniquement en HTTPS
- ✅ `SameSite=Strict` → `SameSite=Lax` (permet les redirections)
- ✅ Détection automatique HTTP/HTTPS

**Commit** : `fix: Remove Secure flag from cookies in development (HTTP), use SameSite=Lax for better compatibility`

**Vérification** :
```bash
# Test du flux complet
curl -s -c /tmp/cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@renergy4all.com","password":"admin123"}'

# Vérifier que le cookie est stocké
cat /tmp/cookies.txt | grep session_id

# Tester l'accès avec le cookie
curl -s -b /tmp/cookies.txt http://localhost:3000/api/auth/check
# Résultat attendu : {"authenticated":true,...}
```

---

## 🔍 Détails techniques

### Comportement des cookies selon l'environnement

| Environnement | Protocole | Flag Secure | SameSite | Fonctionne ? |
|---------------|-----------|-------------|----------|--------------|
| Dev local     | HTTP      | ❌ Non      | Lax      | ✅ Oui       |
| Dev local     | HTTP      | ✅ Oui      | Lax      | ❌ Non       |
| Production    | HTTPS     | ✅ Oui      | Lax      | ✅ Oui       |
| Production    | HTTPS     | ❌ Non      | Lax      | ⚠️ Risque    |

### Pourquoi SameSite=Lax au lieu de Strict ?

**SameSite=Strict** :
- ❌ Bloque les cookies lors des redirections GET (même internes)
- ❌ La redirection après login ne transmet pas le cookie
- ❌ L'utilisateur est immédiatement déconnecté

**SameSite=Lax** :
- ✅ Autorise les cookies lors des redirections GET
- ✅ La session persiste après le login
- ✅ Protection contre la plupart des attaques CSRF
- ✅ Recommandé par les standards web modernes

### Sécurité maintenue

Même sans `SameSite=Strict`, la sécurité reste forte :

1. **HttpOnly** : ✅ Protège contre XSS (JavaScript ne peut pas lire le cookie)
2. **SameSite=Lax** : ✅ Protège contre CSRF (sauf GET simples)
3. **Secure (en prod)** : ✅ Protège contre l'interception (HTTPS uniquement)
4. **Max-Age** : ✅ Expiration après 24h
5. **Path=/** : ✅ Cookie limité à l'application

---

## 📋 Tests de validation

### Test 1 : Connexion
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@renergy4all.com","password":"admin123"}'
```
**Résultat attendu** : `{"success":true}`

### Test 2 : Persistance du cookie
```bash
# Login
curl -c /tmp/cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@renergy4all.com","password":"admin123"}'

# Vérifier la session
curl -b /tmp/cookies.txt http://localhost:3000/api/auth/check
```
**Résultat attendu** : `{"authenticated":true}`

### Test 3 : Accès aux endpoints admin
```bash
# Avec cookie
curl -b /tmp/cookies.txt http://localhost:3000/api/services/admin/all
```
**Résultat attendu** : Liste des services (statut 200)

### Test 4 : Accès sans cookie
```bash
curl http://localhost:3000/api/services/admin/all
```
**Résultat attendu** : `{"error":"Non authentifié"}` (statut 401)

---

## 🚀 Déploiement en production

En production (HTTPS), le flag `Secure` sera automatiquement ajouté :

```javascript
// Détecte automatiquement HTTPS via x-forwarded-proto
const protocol = c.req.header('x-forwarded-proto') || 'http';
const isSecure = protocol === 'https'; // true en production
```

**Configuration finale en production** :
```
Set-Cookie: session_id=xxx; HttpOnly; Secure; SameSite=Lax; Max-Age=86400; Path=/
```

---

## 📖 Références

- [MDN - Cookie SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [MDN - Cookie Secure](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)
- [OWASP - Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

---

## ✅ État actuel

| Fonctionnalité | Statut | Testé |
|----------------|--------|-------|
| Connexion | ✅ Fonctionne | ✅ Oui |
| Session persistante | ✅ Fonctionne | ✅ Oui |
| Accès dashboard | ✅ Fonctionne | ✅ Oui |
| Endpoints admin | ✅ Fonctionne | ✅ Oui |
| Déconnexion | ✅ Fonctionne | ✅ Oui |

---

**Dernière mise à jour** : 31 octobre 2025  
**Statut** : ✅ Tous les problèmes résolus et testés
