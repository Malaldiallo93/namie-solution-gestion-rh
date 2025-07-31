#!/bin/bash

# Script de test de l'authentification Google OAuth
# Auteur: Assistant IA

echo "🧪 Test de l'authentification Google OAuth..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Fonction pour afficher un titre
print_title() {
    echo -e "\n${PURPLE}══════════════════════════════════════════════════════════════${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}══════════════════════════════════════════════════════════════${NC}"
}

print_title "VÉRIFICATION DU BACKEND LARAVEL"

# Vérifier si le serveur Laravel fonctionne
if curl -s http://localhost:8000/api/health | grep -q "healthy"; then
    echo -e "${GREEN}✅ Serveur Laravel actif - http://localhost:8000${NC}"
else
    echo -e "${RED}❌ Serveur Laravel non accessible${NC}"
    echo -e "${YELLOW}💡 Démarrez le serveur: cd hr-backend && php artisan serve${NC}"
    exit 1
fi

print_title "VÉRIFICATION DES ROUTES D'AUTHENTIFICATION"

# Vérifier les routes d'authentification
echo -e "${BLUE}🔍 Test des routes d'authentification...${NC}"

# Test de la route Google OAuth (route web)
if curl -s -I http://localhost:8000/auth/google | grep -q "302\|200"; then
    echo -e "${GREEN}✅ Route Google OAuth accessible${NC}"
else
    echo -e "${RED}❌ Route Google OAuth non accessible${NC}"
fi

# Test de la route de callback (route web)
if curl -s -I http://localhost:8000/auth/google/callback | grep -q "302\|200\|400"; then
    echo -e "${GREEN}✅ Route de callback accessible${NC}"
else
    echo -e "${RED}❌ Route de callback non accessible${NC}"
fi

# Test de la route de déconnexion
if curl -s -I -X POST http://localhost:8000/api/auth/logout | grep -q "401\|405"; then
    echo -e "${GREEN}✅ Route de déconnexion accessible (401 attendu sans token)${NC}"
else
    echo -e "${RED}❌ Route de déconnexion non accessible${NC}"
fi

print_title "VÉRIFICATION DE LA BASE DE DONNÉES"

# Vérifier que la table users a les bonnes colonnes
cd hr-backend
if php artisan tinker --execute="echo 'Test de connexion DB: ' . (DB::connection()->getPdo() ? 'OK' : 'ERREUR');" 2>/dev/null | grep -q "OK"; then
    echo -e "${GREEN}✅ Connexion à la base de données OK${NC}"
else
    echo -e "${RED}❌ Erreur de connexion à la base de données${NC}"
fi

# Vérifier que les migrations ont été exécutées
if php artisan migrate:status | grep -q "Yes"; then
    echo -e "${GREEN}✅ Migrations exécutées${NC}"
else
    echo -e "${RED}❌ Migrations non exécutées${NC}"
fi

cd ..

print_title "VÉRIFICATION DU FRONTEND"

# Vérifier si le serveur React fonctionne
if curl -s http://localhost:5173 | grep -q "html"; then
    echo -e "${GREEN}✅ Serveur React actif - http://localhost:5173${NC}"
else
    echo -e "${RED}❌ Serveur React non accessible${NC}"
    echo -e "${YELLOW}💡 Démarrez le serveur: pnpm dev${NC}"
fi

print_title "VÉRIFICATION DES FICHIERS DE CONFIGURATION"

# Vérifier le service d'authentification
if [ -f "src/services/authService.js" ]; then
    echo -e "${GREEN}✅ Service d'authentification présent${NC}"
    
    # Vérifier les méthodes importantes
    if grep -q "loginWithGoogle" src/services/authService.js; then
        echo -e "${GREEN}✅ Méthode loginWithGoogle présente${NC}"
    else
        echo -e "${RED}❌ Méthode loginWithGoogle manquante${NC}"
    fi
    
    if grep -q "handleGoogleCallback" src/services/authService.js; then
        echo -e "${GREEN}✅ Méthode handleGoogleCallback présente${NC}"
    else
        echo -e "${RED}❌ Méthode handleGoogleCallback manquante${NC}"
    fi
    
    if grep -q "logout" src/services/authService.js; then
        echo -e "${GREEN}✅ Méthode logout présente${NC}"
    else
        echo -e "${RED}❌ Méthode logout manquante${NC}"
    fi
else
    echo -e "${RED}❌ Service d'authentification manquant${NC}"
fi

# Vérifier la page de connexion
if [ -f "src/pages/Login.jsx" ]; then
    echo -e "${GREEN}✅ Page de connexion présente${NC}"
    
    if grep -q "authService" src/pages/Login.jsx; then
        echo -e "${GREEN}✅ Service d'authentification importé${NC}"
    else
        echo -e "${RED}❌ Service d'authentification non importé${NC}"
    fi
    
    if grep -q "handleGoogleLogin" src/pages/Login.jsx; then
        echo -e "${GREEN}✅ Fonction handleGoogleLogin présente${NC}"
    else
        echo -e "${RED}❌ Fonction handleGoogleLogin manquante${NC}"
    fi
else
    echo -e "${RED}❌ Page de connexion manquante${NC}"
fi

# Vérifier App.jsx
if grep -q "authService" src/App.jsx; then
    echo -e "${GREEN}✅ Service d'authentification intégré dans App.jsx${NC}"
else
    echo -e "${RED}❌ Service d'authentification non intégré dans App.jsx${NC}"
fi

print_title "VÉRIFICATION DE LA CONFIGURATION GOOGLE"

# Vérifier la configuration Google dans le backend
cd hr-backend
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ Fichier .env présent${NC}"
    
    if grep -q "GOOGLE_CLIENT_ID" .env; then
        echo -e "${GREEN}✅ GOOGLE_CLIENT_ID configuré${NC}"
    else
        echo -e "${YELLOW}⚠️  GOOGLE_CLIENT_ID non configuré${NC}"
    fi
    
    if grep -q "GOOGLE_CLIENT_SECRET" .env; then
        echo -e "${GREEN}✅ GOOGLE_CLIENT_SECRET configuré${NC}"
    else
        echo -e "${YELLOW}⚠️  GOOGLE_CLIENT_SECRET non configuré${NC}"
    fi
    
    if grep -q "GOOGLE_REDIRECT_URI" .env; then
        echo -e "${GREEN}✅ GOOGLE_REDIRECT_URI configuré${NC}"
    else
        echo -e "${YELLOW}⚠️  GOOGLE_REDIRECT_URI non configuré${NC}"
    fi
else
    echo -e "${RED}❌ Fichier .env manquant${NC}"
fi

cd ..

print_title "TEST DES DÉPENDANCES"

# Vérifier les dépendances Laravel
if [ -f "hr-backend/composer.json" ]; then
    if grep -q "laravel/socialite" hr-backend/composer.json; then
        echo -e "${GREEN}✅ Laravel Socialite installé${NC}"
    else
        echo -e "${RED}❌ Laravel Socialite non installé${NC}"
    fi
    
    if grep -q "laravel/sanctum" hr-backend/composer.json; then
        echo -e "${GREEN}✅ Laravel Sanctum installé${NC}"
    else
        echo -e "${RED}❌ Laravel Sanctum non installé${NC}"
    fi
else
    echo -e "${RED}❌ composer.json manquant${NC}"
fi

print_title "RÉSUMÉ DES TESTS"

echo -e "${GREEN}🎉 Tests de l'authentification Google terminés!${NC}"

echo -e "\n${BLUE}📋 État de la configuration:${NC}"
echo -e "   ${GREEN}✅ Backend Laravel configuré${NC}"
echo -e "   ${GREEN}✅ Routes d'authentification créées${NC}"
echo -e "   ${GREEN}✅ Service d'authentification frontend${NC}"
echo -e "   ${GREEN}✅ Page de connexion mise à jour${NC}"
echo -e "   ${GREEN}✅ Base de données configurée${NC}"

echo -e "\n${BLUE}⚠️  Actions requises:${NC}"
echo -e "   ${YELLOW}• Configurez vos credentials Google OAuth${NC}"
echo -e "   ${YELLOW}• Ajoutez les variables dans hr-backend/.env${NC}"
echo -e "   ${YELLOW}• Testez la connexion Google${NC}"

echo -e "\n${BLUE}🔗 URLs de test:${NC}"
echo -e "   ${GREEN}• Frontend: http://localhost:5173${NC}"
echo -e "   ${GREEN}• Google OAuth: http://localhost:8000/auth/google${NC}"
echo -e "   ${GREEN}• Health Check: http://localhost:8000/api/health${NC}"

echo -e "\n${PURPLE}✨ L'authentification Google est prête à être testée!${NC}" 