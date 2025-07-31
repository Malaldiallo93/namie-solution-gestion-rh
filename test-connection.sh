#!/bin/bash

echo "🔍 Test de la connexion Google OAuth..."

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "\n${BLUE}1. Test du serveur Laravel...${NC}"
if curl -s http://localhost:8000 > /dev/null; then
    echo -e "${GREEN}✅ Serveur Laravel actif${NC}"
else
    echo -e "${RED}❌ Serveur Laravel non accessible${NC}"
    echo -e "${YELLOW}💡 Démarrez avec: cd hr-backend && php artisan serve${NC}"
    exit 1
fi

echo -e "\n${BLUE}2. Test du serveur React...${NC}"
if curl -s http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✅ Serveur React actif${NC}"
else
    echo -e "${RED}❌ Serveur React non accessible${NC}"
    echo -e "${YELLOW}💡 Démarrez avec: pnpm dev${NC}"
    exit 1
fi

echo -e "\n${BLUE}3. Test de la route Google OAuth...${NC}"
if curl -s -I http://localhost:8000/auth/google | grep -q "302"; then
    echo -e "${GREEN}✅ Route Google OAuth fonctionne${NC}"
else
    echo -e "${RED}❌ Route Google OAuth ne fonctionne pas${NC}"
    exit 1
fi

echo -e "\n${BLUE}4. Test de la route de callback...${NC}"
if curl -s -I http://localhost:8000/auth/google/callback | grep -q "200\|400\|302"; then
    echo -e "${GREEN}✅ Route de callback accessible${NC}"
else
    echo -e "${RED}❌ Route de callback non accessible${NC}"
    exit 1
fi

echo -e "\n${GREEN}🎉 Tous les tests sont passés !${NC}"
echo -e "\n${BLUE}📋 Prochaines étapes:${NC}"
echo -e "   ${YELLOW}1. Ouvrez http://localhost:5173${NC}"
echo -e "   ${YELLOW}2. Cliquez sur 'Continue with Google'${NC}"
echo -e "   ${YELLOW}3. Configurez vos credentials Google si nécessaire${NC}"

echo -e "\n${BLUE}🔗 URLs importantes:${NC}"
echo -e "   ${GREEN}• Frontend: http://localhost:5173${NC}"
echo -e "   ${GREEN}• Google OAuth: http://localhost:8000/auth/google${NC}"
echo -e "   ${GREEN}• Callback: http://localhost:8000/auth/google/callback${NC}" 