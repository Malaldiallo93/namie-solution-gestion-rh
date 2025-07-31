# 🔐 Guide d'Authentification Google OAuth

## 📋 Vue d'ensemble

Ce guide vous explique comment configurer l'authentification Google OAuth pour votre application HR Dashboard. L'authentification permet aux utilisateurs de se connecter avec leur compte Gmail et d'être enregistrés automatiquement dans la base de données.

## 🏗️ Architecture

- **Frontend React** : Interface utilisateur avec bouton "Continue with Google"
- **Backend Laravel** : API REST avec Laravel Socialite pour OAuth
- **Base de données MySQL** : Stockage des utilisateurs et sessions
- **Laravel Sanctum** : Gestion des tokens d'authentification

## 🚀 Configuration étape par étape

### 1. Configuration Google OAuth

#### 1.1 Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.developers.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google+ (ou Google Identity)

#### 1.2 Configurer les credentials OAuth

1. Dans le menu, allez dans **"APIs & Services" > "Credentials"**
2. Cliquez sur **"Create Credentials" > "OAuth 2.0 Client ID"**
3. Configurez l'application :
   - **Application type** : Web application
   - **Name** : HR Dashboard
   - **Authorized redirect URIs** :
     - `http://localhost:8000/auth/google/callback` (développement)
     - `https://votre-domaine.com/auth/google/callback` (production)

#### 1.3 Récupérer les credentials

Après création, vous obtiendrez :
- **Client ID** : `123456789-abcdef.apps.googleusercontent.com`
- **Client Secret** : `GOCSPX-abcdefghijklmnop`

### 2. Configuration Backend Laravel

#### 2.1 Variables d'environnement

Ajoutez ces variables dans `hr-backend/.env` :

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=votre-client-id-ici
GOOGLE_CLIENT_SECRET=votre-client-secret-ici
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

#### 2.2 Vérifier l'installation

Exécutez le script de test :
```bash
./test-google-auth.sh
```

### 3. Configuration Frontend

Le frontend est déjà configuré avec :
- Service d'authentification (`src/services/authService.js`)
- Page de connexion mise à jour (`src/pages/Login.jsx`)
- Intégration dans l'application (`src/App.jsx`)

### 4. Démarrage des services

#### 4.1 Backend Laravel
```bash
cd hr-backend
php artisan serve --host=0.0.0.0 --port=8000
```

#### 4.2 Frontend React
```bash
pnpm dev
```

## 🔗 URLs importantes

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:8000/api
- **Google OAuth** : http://localhost:8000/auth/google
- **Health Check** : http://localhost:8000/api/health

## 🧪 Test de l'authentification

### 1. Test manuel

1. Ouvrez http://localhost:5173
2. Cliquez sur "Continue with Google"
3. Autorisez l'application dans Google
4. Vérifiez que vous êtes connecté

### 2. Test API

```bash
# Vérifier l'état de l'API
curl http://localhost:8000/api/health

# Tester la route Google OAuth
curl -I http://localhost:8000/auth/google
```

## 📊 Fonctionnalités implémentées

### ✅ Backend Laravel
- [x] Modèle User avec champs Google (`google_id`, `avatar`)
- [x] Contrôleur GoogleController avec méthodes OAuth
- [x] Routes d'authentification (`/auth/google`, `/auth/google/callback`)
- [x] Laravel Socialite pour OAuth
- [x] Laravel Sanctum pour tokens API
- [x] Migration de base de données

### ✅ Frontend React
- [x] Service d'authentification (`authService.js`)
- [x] Page de connexion avec bouton Google
- [x] Gestion des callbacks OAuth
- [x] Stockage des tokens dans localStorage
- [x] Intégration avec App.jsx
- [x] Gestion de la déconnexion

### ✅ Base de données
- [x] Table `users` avec champs Google
- [x] Table `personal_access_tokens` pour Sanctum
- [x] Migration automatique

## 🔧 Dépannage

### Problèmes courants

#### 1. "Route Google OAuth non accessible"
- Vérifiez que le serveur Laravel fonctionne : `php artisan serve`
- Vérifiez les routes web : `php artisan route:list | grep auth`
- Vérifiez que les sessions sont configurées

#### 2. "Erreur de credentials Google"
- Vérifiez que les variables d'environnement sont correctes
- Vérifiez que l'URI de redirection correspond dans Google Console

#### 3. "Erreur de base de données"
- Exécutez les migrations : `php artisan migrate`
- Vérifiez la connexion DB dans `.env`

#### 4. "Erreur CORS"
- Le frontend et backend doivent être sur les bons ports
- Vérifiez les URLs de redirection dans Google Console

### Scripts de diagnostic

```bash
# Test complet de l'authentification
./test-google-auth.sh

# Test de la configuration
./setup-google-auth.sh

# Vérifier les routes Laravel
cd hr-backend && php artisan route:list | grep auth
```

## 📝 Notes importantes

1. **Sécurité** : Ne partagez jamais vos credentials Google
2. **Production** : Changez les URLs de redirection pour votre domaine
3. **HTTPS** : Google OAuth nécessite HTTPS en production
4. **Quotas** : Google impose des limites sur les appels OAuth

## 🎯 Prochaines étapes

1. **Configurer vos credentials Google** selon ce guide
2. **Tester l'authentification** avec un compte Gmail
3. **Personnaliser l'interface** selon vos besoins
4. **Déployer en production** avec HTTPS

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs Laravel : `tail -f hr-backend/storage/logs/laravel.log`
2. Vérifiez la console du navigateur pour les erreurs JavaScript
3. Testez les endpoints API individuellement

---

**✨ L'authentification Google est maintenant configurée et prête à être utilisée !** 