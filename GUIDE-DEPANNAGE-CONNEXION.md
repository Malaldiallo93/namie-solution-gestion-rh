# 🔧 Guide de Dépannage - Problèmes de Connexion

## ❌ Problème identifié
Vous ne pouvez pas vous connecter ou créer un compte. L'erreur "Erreur lors de l'inscription. Veuillez réessayer." apparaît.

## 🔍 Diagnostic

### **1. Vérification des serveurs**
```bash
# Vérifier que les serveurs fonctionnent
./test-connection.sh
```

### **2. Problèmes courants identifiés**

#### **A. Serveur React sur le mauvais port**
- **Problème** : Vous utilisez le port 5177 au lieu de 5173
- **Solution** : Utilisez les bonnes URLs
  - **Inscription** : http://localhost:5177/register
  - **Connexion** : http://localhost:5177
  - **Page d'accueil** : http://localhost:5177/

#### **B. Utilisateur déjà connecté**
- **Problème** : Un token d'authentification existe déjà
- **Solution** : Nettoyer le localStorage
  1. Ouvrez les outils de développement (F12)
  2. Allez dans l'onglet Console
  3. Tapez : `localStorage.clear()`
  4. Appuyez sur Entrée
  5. Rechargez la page (F5)

#### **C. Erreur dans le code d'inscription**
- **Problème** : Import incorrect du service d'authentification
- **Solution** : ✅ **Corrigé** - L'import est maintenant correct

## 🛠️ Solutions étape par étape

### **Solution 1 : Réinitialiser l'authentification**

1. **Ouvrez votre navigateur**
2. **Appuyez sur F12** pour ouvrir les outils de développement
3. **Allez dans l'onglet "Console"**
4. **Tapez cette commande** :
   ```javascript
   localStorage.clear()
   ```
5. **Appuyez sur Entrée**
6. **Rechargez la page** (F5)

### **Solution 2 : Tester l'inscription**

1. **Allez sur** : http://localhost:5177/register
2. **Remplissez le formulaire** :
   - Prénom : Votre prénom
   - Nom : Votre nom
   - Email : Votre email
   - Entreprise : Votre entreprise
   - Rôle : Votre rôle
   - Mot de passe : Un mot de passe
   - Confirmer le mot de passe : Le même mot de passe
3. **Cochez** "I agree to the Terms of Service and Privacy Policy"
4. **Cliquez** sur "Create Account"

### **Solution 3 : Vérifier la console**

Si l'erreur persiste :
1. **Ouvrez les outils de développement** (F12)
2. **Allez dans l'onglet "Console"**
3. **Regardez les erreurs** en rouge
4. **Notez les messages d'erreur** pour diagnostic

## 🧪 Tests de vérification

### **Test 1 : Vérifier les serveurs**
```bash
./test-connection.sh
```

### **Test 2 : Vérifier l'inscription**
```bash
./test-registration.sh
```

### **Test 3 : Vérifier les informations utilisateur**
```bash
./test-user-info.sh
```

### **Test 4 : Réinitialiser l'authentification**
```bash
./reset-auth.sh
```

## 📋 Checklist de dépannage

### **Avant de tester :**
- [ ] Serveur React fonctionne sur le port 5177
- [ ] Serveur Laravel fonctionne sur le port 8000
- [ ] localStorage est vide (utilisez `localStorage.clear()`)
- [ ] Console du navigateur ne montre pas d'erreurs

### **Pendant le test :**
- [ ] Tous les champs du formulaire sont remplis
- [ ] Les mots de passe correspondent
- [ ] Les conditions sont acceptées
- [ ] Pas d'erreurs dans la console

### **Après le test :**
- [ ] Redirection vers la page d'accueil
- [ ] Informations personnelles affichées
- [ ] Initiales correctes dans l'avatar
- [ ] Entreprise et rôle affichés

## 🔗 URLs importantes

- **Inscription** : http://localhost:5177/register
- **Connexion** : http://localhost:5177
- **Page d'accueil** : http://localhost:5177/
- **Dashboard HR** : http://localhost:5177/dashboard

## ❓ Problèmes spécifiques

### **"Page non trouvée"**
- Vérifiez que vous utilisez le bon port (5177)
- Vérifiez que le serveur React fonctionne

### **"Erreur lors de l'inscription"**
- Vérifiez la console du navigateur
- Assurez-vous que tous les champs sont remplis
- Vérifiez que les mots de passe correspondent

### **"Utilisateur déjà connecté"**
- Nettoyez le localStorage avec `localStorage.clear()`
- Rechargez la page

### **"Informations non affichées"**
- Vérifiez que l'inscription a bien stocké les informations
- Vérifiez que la page d'accueil récupère les bonnes données

## 📞 Support

Si le problème persiste :
1. **Notez les erreurs** de la console
2. **Vérifiez les logs** du serveur
3. **Testez avec les scripts** fournis
4. **Consultez la documentation** créée

---

**✨ Avec ces solutions, l'inscription et la connexion devraient fonctionner correctement !** 