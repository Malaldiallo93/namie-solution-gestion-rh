# 🎯 Guide Google Cloud Console - Étape par Étape

## 📋 Prérequis
- Un compte Google
- Accès à Google Cloud Console

## 🚀 Étape 1 : Accéder à Google Cloud Console

1. **Ouvrez votre navigateur** et allez sur : https://console.developers.google.com/
2. **Connectez-vous** avec votre compte Google
3. **Acceptez les conditions** si demandé

## 🏗️ Étape 2 : Créer ou sélectionner un projet

### Option A : Créer un nouveau projet
1. **Cliquez sur le sélecteur de projet** (en haut à gauche)
2. **Cliquez sur "Nouveau projet"**
3. **Nommez votre projet** : `HR Dashboard` ou `YourHR Platform`
4. **Cliquez sur "Créer"**

### Option B : Utiliser un projet existant
1. **Cliquez sur le sélecteur de projet**
2. **Sélectionnez un projet existant** dans la liste

## 🔧 Étape 3 : Activer l'API Google+

1. **Dans le menu de gauche**, cliquez sur **"APIs & Services" > "Library"**
2. **Recherchez** "Google+ API" ou "Google Identity"
3. **Cliquez sur l'API** dans les résultats
4. **Cliquez sur "Activer"**

## 🔑 Étape 4 : Créer les credentials OAuth

1. **Dans le menu de gauche**, cliquez sur **"APIs & Services" > "Credentials"**
2. **Cliquez sur "Créer des credentials"** (bouton bleu en haut)
3. **Sélectionnez "ID client OAuth 2.0"**

## ⚙️ Étape 5 : Configurer l'application OAuth

### Informations de base
- **Nom de l'application** : `HR Dashboard`
- **Type d'application** : `Application Web`

### URIs autorisés
1. **Cliquez sur "Ajouter un URI"** dans la section "URIs de redirection autorisés"
2. **Ajoutez** : `http://localhost:8000/auth/google/callback`
3. **Cliquez sur "Créer"**

## 📋 Étape 6 : Récupérer les credentials

Après création, vous verrez :
- **ID client** : `123456789-abcdefghijklmnop.apps.googleusercontent.com`
- **Secret client** : `GOCSPX-abcdefghijklmnopqrstuvwxyz`

⚠️ **IMPORTANT** : Notez ces informations, vous en aurez besoin !

## 🔧 Étape 7 : Configurer le fichier .env

1. **Ouvrez** le fichier `hr-backend/.env`
2. **Ajoutez** ces lignes à la fin :

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=votre-client-id-ici
GOOGLE_CLIENT_SECRET=votre-client-secret-ici
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

3. **Remplacez** `votre-client-id-ici` et `votre-client-secret-ici` par vos vraies valeurs

## 🧪 Étape 8 : Tester la configuration

```bash
# Vérifier que les variables sont configurées
cd hr-backend && grep -E "GOOGLE_CLIENT_ID|GOOGLE_CLIENT_SECRET" .env

# Tester la connexion
cd .. && ./test-connection.sh
```

## 🎯 Étape 9 : Test final

1. **Ouvrez** http://localhost:5173
2. **Cliquez** sur "Continue with Google"
3. **Autorisez** l'application dans Google
4. **Vérifiez** que vous êtes connecté

## ❓ Problèmes courants

### "Erreur de redirection"
- Vérifiez que l'URI de redirection correspond exactement
- Assurez-vous qu'il n'y a pas d'espaces en trop

### "API non activée"
- Retournez dans "APIs & Services" > "Library"
- Activez l'API Google+ ou Google Identity

### "Credentials invalides"
- Vérifiez que vous avez copié le bon Client ID et Secret
- Assurez-vous qu'il n'y a pas d'espaces en trop

## 📞 Support

Si vous avez des problèmes :
1. Vérifiez que tous les serveurs fonctionnent
2. Consultez les logs Laravel : `tail -f hr-backend/storage/logs/laravel.log`
3. Vérifiez la console du navigateur pour les erreurs JavaScript

---

**✨ Une fois configuré, l'authentification Google fonctionnera parfaitement !** 