# 🚀 Configuration Rapide Google OAuth

## ❌ Problème identifié
Les variables d'environnement Google OAuth ne sont pas configurées dans `hr-backend/.env`.

## ✅ Solution étape par étape

### 1. Créer un projet Google Cloud

1. **Allez sur** [Google Cloud Console](https://console.developers.google.com/)
2. **Créez un nouveau projet** ou sélectionnez un projet existant
3. **Activez l'API Google+** (ou Google Identity)

### 2. Configurer les credentials OAuth

1. **Dans le menu**, allez dans **"APIs & Services" > "Credentials"**
2. **Cliquez sur** **"Create Credentials" > "OAuth 2.0 Client ID"**
3. **Configurez l'application** :
   - **Application type** : `Web application`
   - **Name** : `HR Dashboard`
   - **Authorized redirect URIs** :
     ```
     http://localhost:8000/auth/google/callback
     ```

### 3. Récupérer les credentials

Après création, vous obtiendrez :
- **Client ID** : `123456789-abcdef.apps.googleusercontent.com`
- **Client Secret** : `GOCSPX-abcdefghijklmnop`

### 4. Ajouter les variables dans .env

**Ouvrez** `hr-backend/.env` et **ajoutez** ces lignes :

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=votre-client-id-ici
GOOGLE_CLIENT_SECRET=votre-client-secret-ici
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

### 5. Tester la configuration

```bash
# Vérifier que les variables sont configurées
cd hr-backend && grep -E "GOOGLE_CLIENT_ID|GOOGLE_CLIENT_SECRET" .env

# Tester la connexion
cd .. && ./test-connection.sh
```

## 🔗 URLs importantes

- **Frontend** : http://localhost:5173
- **Google OAuth** : http://localhost:8000/auth/google
- **Callback** : http://localhost:8000/auth/google/callback

## 🧪 Test final

1. **Ouvrez** http://localhost:5173
2. **Cliquez** sur "Continue with Google"
3. **Autorisez** l'application dans Google
4. **Vérifiez** que vous êtes connecté

## ❓ Aide

Si vous avez des problèmes :
- Vérifiez que les URIs de redirection correspondent exactement
- Assurez-vous que l'API Google+ est activée
- Vérifiez que les serveurs Laravel et React fonctionnent

---

**✨ Une fois configuré, l'authentification Google fonctionnera parfaitement !** 