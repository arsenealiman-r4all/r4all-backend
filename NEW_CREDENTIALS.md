# 🔐 NOUVEAUX IDENTIFIANTS ADMIN - Renergy4all Backoffice

**Date de génération** : 31 octobre 2025  
**Statut** : ✅ ACTIF ET TESTÉ

---

## 🔑 Identifiants de connexion

### **URL de connexion**
https://3000-i0rss0thexh52uxvqi216-0e616f0a.sandbox.novita.ai/login

### **Compte Administrateur**
- **Email** : `admin@renergy4all.com`
- **Mot de passe** : `5pOl26mEWSm2xYoO`

---

## ⚠️ IMPORTANT - Sécurité

### **Ce mot de passe est :**
- ✅ Généré aléatoirement (16 caractères)
- ✅ Hautement sécurisé (lettres majuscules, minuscules et chiffres)
- ✅ Unique et non devinable
- ✅ Hashé en SHA-256 dans la base de données

### **Recommandations :**
1. 🔒 **Gardez ce document en lieu sûr**
2. 🔒 **Ne partagez pas ce mot de passe par email non sécurisé**
3. 🔒 **Changez le mot de passe si vous suspectez une compromission**
4. 🔒 **En production, utilisez un gestionnaire de mots de passe**

---

## 🔄 Comment changer le mot de passe à nouveau

### Méthode 1 : Générer un nouveau mot de passe fort
```bash
cd /home/user/webapp

# Générer un nouveau mot de passe aléatoire
openssl rand -base64 16 | tr -d "=+/" | cut -c1-16

# Mettre à jour le script generate-new-password.js avec le nouveau mot de passe
# Puis exécuter :
node generate-new-password.js

# Copier la commande SQL affichée et l'exécuter :
npx wrangler d1 execute renergy-backoffice-db --local --command="UPDATE users SET password='NOUVEAU_HASH' WHERE email='admin@renergy4all.com';"
```

### Méthode 2 : Utiliser votre propre mot de passe
```bash
cd /home/user/webapp

# Modifier le fichier generate-new-password.js
# Remplacer la ligne : const password = '5pOl26mEWSm2xYoO';
# Par : const password = 'votre_nouveau_mot_de_passe';

# Puis exécuter les mêmes commandes que la méthode 1
```

---

## 📝 Détails techniques

### Hash actuel (SHA-256)
```
Mot de passe : 5pOl26mEWSm2xYoO
Hash SHA-256 : e418df0e1529ff1ebc9095873d8261bc15a9cc392ef690b3d20f1c829b136761
```

### Enregistrement en base de données
```sql
-- Email utilisateur
email: admin@renergy4all.com

-- Hash du mot de passe (SHA-256)
password: e418df0e1529ff1ebc9095873d8261bc15a9cc392ef690b3d20f1c829b136761

-- Nom affiché
name: Administrateur

-- Rôle
role: admin
```

---

## ✅ Test de validation

La connexion a été testée et fonctionne :

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@renergy4all.com","password":"5pOl26mEWSm2xYoO"}'

# Résultat : {"success":true,"user":{...}}
```

---

## 🚨 En cas de perte du mot de passe

Si vous perdez ce mot de passe, vous pouvez le réinitialiser avec cette commande :

```bash
cd /home/user/webapp

# Générer un nouveau mot de passe
openssl rand -base64 16 | tr -d "=+/" | cut -c1-16

# Suivre les étapes de la Méthode 1 ci-dessus
```

---

## 📅 Historique des mots de passe

| Date | Mot de passe | Statut | Note |
|------|--------------|--------|------|
| 31 oct 2025 - 18h00 | `admin123` | ❌ Révoqué | Mot de passe initial de test |
| 31 oct 2025 - 18h45 | `5pOl26mEWSm2xYoO` | ✅ ACTIF | Mot de passe fort généré |

---

## 🔐 Sécurité renforcée

Ce nouveau mot de passe offre une sécurité significativement améliorée :

| Critère | Ancien (admin123) | Nouveau (5pOl26mEWSm2xYoO) |
|---------|-------------------|---------------------------|
| Longueur | 8 caractères | 16 caractères |
| Majuscules | ❌ | ✅ |
| Minuscules | ✅ | ✅ |
| Chiffres | ✅ | ✅ |
| Caractères spéciaux | ❌ | ❌ (non nécessaires avec 16 car.) |
| Prévisibilité | ⚠️ Élevée | ✅ Nulle (aléatoire) |
| Résistance brute force | ⚠️ Faible | ✅ Très élevée |

**Estimation de sécurité** :
- Ancien : ~10^9 combinaisons possibles
- Nouveau : ~10^28 combinaisons possibles

---

## 📞 Support

Si vous avez des questions sur la gestion des mots de passe ou l'authentification, consultez :
- `CREDENTIALS.md` - Guide de gestion des identifiants
- `FIXES.md` - Documentation des correctifs de sécurité
- `README.md` - Documentation complète

---

**⚠️ IMPORTANT : Gardez ce fichier confidentiel et sécurisé !**

---

**Dernière mise à jour** : 31 octobre 2025 - 18h45  
**Statut** : ✅ MOT DE PASSE ACTIF ET VÉRIFIÉ
