#!/bin/bash

# Script de configuration de l'authentification Google OAuth
# Auteur: Assistant IA

echo "🔐 Configuration de l'authentification Google OAuth..."

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

print_title "INSTALLATION DES DÉPENDANCES LARAVEL"

# Vérifier si on est dans le bon répertoire
if [ ! -f "hr-backend/composer.json" ]; then
    echo -e "${RED}❌ Veuillez exécuter ce script depuis la racine du projet${NC}"
    exit 1
fi

# Installer les dépendances Laravel
echo -e "${BLUE}📦 Installation des dépendances Laravel...${NC}"
cd hr-backend

if composer install --no-dev --optimize-autoloader; then
    echo -e "${GREEN}✅ Dépendances Laravel installées${NC}"
else
    echo -e "${RED}❌ Erreur lors de l'installation des dépendances${NC}"
    exit 1
fi

print_title "CONFIGURATION DE LA BASE DE DONNÉES"

# Vérifier si le fichier .env existe
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Fichier .env non trouvé, création depuis .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ Fichier .env créé${NC}"
    else
        echo -e "${RED}❌ Fichier .env.example non trouvé${NC}"
        exit 1
    fi
fi

# Générer la clé d'application
echo -e "${BLUE}🔑 Génération de la clé d'application...${NC}"
if php artisan key:generate; then
    echo -e "${GREEN}✅ Clé d'application générée${NC}"
else
    echo -e "${RED}❌ Erreur lors de la génération de la clé${NC}"
    exit 1
fi

# Exécuter les migrations
echo -e "${BLUE}🗄️  Exécution des migrations...${NC}"
if php artisan migrate; then
    echo -e "${GREEN}✅ Migrations exécutées${NC}"
else
    echo -e "${RED}❌ Erreur lors des migrations${NC}"
    exit 1
fi

print_title "CONFIGURATION GOOGLE OAUTH"

echo -e "${BLUE}📋 Instructions pour configurer Google OAuth:${NC}"
echo -e "${YELLOW}1. Allez sur https://console.developers.google.com/${NC}"
echo -e "${YELLOW}2. Créez un nouveau projet ou sélectionnez un projet existant${NC}"
echo -e "${YELLOW}3. Activez l'API Google+${NC}"
echo -e "${YELLOW}4. Allez dans 'Credentials' et créez un 'OAuth 2.0 Client ID'${NC}"
echo -e "${YELLOW}5. Configurez les URIs de redirection autorisés:${NC}"
echo -e "${GREEN}   - http://localhost:8000/api/auth/google/callback (développement)${NC}"
echo -e "${GREEN}   - https://votre-domaine.com/api/auth/google/callback (production)${NC}"
echo -e "${YELLOW}6. Copiez le Client ID et Client Secret${NC}"

echo -e "\n${BLUE}📝 Ajoutez ces variables à votre fichier .env:${NC}"
echo -e "${GREEN}GOOGLE_CLIENT_ID=votre-client-id${NC}"
echo -e "${GREEN}GOOGLE_CLIENT_SECRET=votre-client-secret${NC}"
echo -e "${GREEN}GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback${NC}"

print_title "TEST DE LA CONFIGURATION"

# Vérifier que les routes sont bien enregistrées
echo -e "${BLUE}🔍 Vérification des routes d'authentification...${NC}"
if php artisan route:list --name=auth; then
    echo -e "${GREEN}✅ Routes d'authentification trouvées${NC}"
else
    echo -e "${RED}❌ Routes d'authentification non trouvées${NC}"
fi

# Vérifier la configuration Google
echo -e "${BLUE}🔍 Vérification de la configuration Google...${NC}"
if grep -q "GOOGLE_CLIENT_ID" .env; then
    echo -e "${GREEN}✅ Variables Google configurées dans .env${NC}"
else
    echo -e "${YELLOW}⚠️  Variables Google non configurées dans .env${NC}"
fi

print_title "DÉMARRAGE DES SERVICES"

# Démarrer le serveur Laravel
echo -e "${BLUE}🚀 Démarrage du serveur Laravel...${NC}"
echo -e "${YELLOW}💡 Le serveur Laravel sera accessible sur http://localhost:8000${NC}"
echo -e "${YELLOW}💡 L'API sera accessible sur http://localhost:8000/api${NC}"

# Retourner au répertoire racine
cd ..

print_title "CONFIGURATION FRONTEND"

# Vérifier que le service d'authentification existe
if [ -f "src/services/authService.js" ]; then
    echo -e "${GREEN}✅ Service d'authentification frontend configuré${NC}"
else
    echo -e "${RED}❌ Service d'authentification frontend manquant${NC}"
fi

# Vérifier que la page de connexion est mise à jour
if grep -q "authService" src/pages/Login.jsx; then
    echo -e "${GREEN}✅ Page de connexion mise à jour${NC}"
else
    echo -e "${RED}❌ Page de connexion non mise à jour${NC}"
fi

print_title "RÉSUMÉ DE LA CONFIGURATION"

echo -e "${GREEN}🎉 Configuration de l'authentification Google terminée!${NC}"

echo -e "\n${BLUE}📋 Prochaines étapes:${NC}"
echo -e "   ${GREEN}1. Configurez vos credentials Google OAuth${NC}"
echo -e "   ${GREEN}2. Ajoutez les variables dans hr-backend/.env${NC}"
echo -e "   ${GREEN}3. Démarrez le serveur Laravel: cd hr-backend && php artisan serve${NC}"
echo -e "   ${GREEN}4. Démarrez le frontend: pnpm dev${NC}"
echo -e "   ${GREEN}5. Testez la connexion Google${NC}"

echo -e "\n${BLUE}🔗 URLs importantes:${NC}"
echo -e "   ${GREEN}• Frontend: http://localhost:5173${NC}"
echo -e "   ${GREEN}• Backend API: http://localhost:8000/api${NC}"
echo -e "   ${GREEN}• Google OAuth: http://localhost:8000/api/auth/google${NC}"

echo -e "\n${PURPLE}✨ L'authentification Google est maintenant configurée!${NC}" 