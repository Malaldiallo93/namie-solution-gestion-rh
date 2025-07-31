#!/bin/bash

echo "🔧 Configuration Google OAuth - Assistant Interactif"
echo "=================================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Vérifier si on est dans le bon répertoire
if [ ! -f "hr-backend/composer.json" ]; then
    echo -e "${RED}❌ Veuillez exécuter ce script depuis la racine du projet${NC}"
    exit 1
fi

echo -e "\n${BLUE}📋 Instructions préliminaires :${NC}"
echo -e "${YELLOW}1. Ouvrez https://console.developers.google.com/${NC}"
echo -e "${YELLOW}2. Créez un projet et activez l'API Google+${NC}"
echo -e "${YELLOW}3. Créez des credentials OAuth 2.0${NC}"
echo -e "${YELLOW}4. URI de redirection : http://localhost:8000/auth/google/callback${NC}"

echo -e "\n${BLUE}🔑 Configuration des variables d'environnement :${NC}"

# Demander le Client ID
read -p "Entrez votre Google Client ID: " CLIENT_ID

if [ -z "$CLIENT_ID" ]; then
    echo -e "${RED}❌ Client ID requis${NC}"
    exit 1
fi

# Demander le Client Secret
read -p "Entrez votre Google Client Secret: " CLIENT_SECRET

if [ -z "$CLIENT_SECRET" ]; then
    echo -e "${RED}❌ Client Secret requis${NC}"
    exit 1
fi

echo -e "\n${BLUE}📝 Ajout des variables au fichier .env...${NC}"

# Vérifier si le fichier .env existe
if [ ! -f "hr-backend/.env" ]; then
    echo -e "${YELLOW}⚠️  Fichier .env non trouvé, création depuis .env.example...${NC}"
    if [ -f "hr-backend/.env.example" ]; then
        cp hr-backend/.env.example hr-backend/.env
    else
        echo -e "${RED}❌ Fichier .env.example non trouvé${NC}"
        exit 1
    fi
fi

# Ajouter les variables Google OAuth
echo "" >> hr-backend/.env
echo "# Google OAuth Configuration" >> hr-backend/.env
echo "GOOGLE_CLIENT_ID=$CLIENT_ID" >> hr-backend/.env
echo "GOOGLE_CLIENT_SECRET=$CLIENT_SECRET" >> hr-backend/.env
echo "GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback" >> hr-backend/.env
echo "FRONTEND_URL=http://localhost:5173" >> hr-backend/.env

echo -e "${GREEN}✅ Variables ajoutées au fichier .env${NC}"

# Vérifier la configuration
echo -e "\n${BLUE}🔍 Vérification de la configuration...${NC}"

if grep -q "GOOGLE_CLIENT_ID" hr-backend/.env; then
    echo -e "${GREEN}✅ GOOGLE_CLIENT_ID configuré${NC}"
else
    echo -e "${RED}❌ GOOGLE_CLIENT_ID non configuré${NC}"
fi

if grep -q "GOOGLE_CLIENT_SECRET" hr-backend/.env; then
    echo -e "${GREEN}✅ GOOGLE_CLIENT_SECRET configuré${NC}"
else
    echo -e "${RED}❌ GOOGLE_CLIENT_SECRET non configuré${NC}"
fi

if grep -q "GOOGLE_REDIRECT_URI" hr-backend/.env; then
    echo -e "${GREEN}✅ GOOGLE_REDIRECT_URI configuré${NC}"
else
    echo -e "${RED}❌ GOOGLE_REDIRECT_URI non configuré${NC}"
fi

# Tester la configuration
echo -e "\n${BLUE}🧪 Test de la configuration...${NC}"

if [ -f "test-connection.sh" ]; then
    ./test-connection.sh
else
    echo -e "${YELLOW}⚠️  Script de test non trouvé${NC}"
fi

echo -e "\n${GREEN}🎉 Configuration terminée !${NC}"
echo -e "\n${BLUE}📋 Prochaines étapes :${NC}"
echo -e "${YELLOW}1. Assurez-vous que les serveurs fonctionnent${NC}"
echo -e "${YELLOW}2. Ouvrez http://localhost:5173${NC}"
echo -e "${YELLOW}3. Testez la connexion Google${NC}"

echo -e "\n${BLUE}🔗 URLs importantes :${NC}"
echo -e "${GREEN}• Frontend : http://localhost:5173${NC}"
echo -e "${GREEN}• Google OAuth : http://localhost:8000/auth/google${NC}"
echo -e "${GREEN}• Callback : http://localhost:8000/auth/google/callback${NC}" 