#!/bin/bash

echo "🧪 Test simple de l'application..."
echo "=================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "\n${BLUE}1. Test du serveur...${NC}"
if curl -s http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✅ Serveur actif sur le port 5173${NC}"
    PORT=5173
else
    echo -e "${RED}❌ Serveur non accessible${NC}"
    echo -e "${YELLOW}💡 Démarrez avec: npm run dev${NC}"
    exit 1
fi

echo -e "\n${BLUE}2. Test de la page HTML...${NC}"
if curl -s "http://localhost:${PORT}/" | grep -q "Vite App"; then
    echo -e "${GREEN}✅ Page HTML chargée${NC}"
else
    echo -e "${RED}❌ Page HTML non accessible${NC}"
fi

echo -e "\n${BLUE}3. Test de la page de connexion...${NC}"
if curl -s "http://localhost:${PORT}/" | grep -q "Sign in"; then
    echo -e "${GREEN}✅ Page de connexion détectée${NC}"
else
    echo -e "${YELLOW}⚠️  Page de connexion non détectée (peut être normale)${NC}"
fi

echo -e "\n${BLUE}4. Instructions de test manuel...${NC}"
echo -e "${YELLOW}1. Ouvrez votre navigateur${NC}"
echo -e "${YELLOW}2. Allez sur http://localhost:${PORT}${NC}"
echo -e "${YELLOW}3. Appuyez sur F12 pour ouvrir les outils de développement${NC}"
echo -e "${YELLOW}4. Allez dans l'onglet 'Console'${NC}"
echo -e "${YELLOW}5. Regardez s'il y a des erreurs en rouge${NC}"

echo -e "\n${BLUE}5. Nettoyage du localStorage...${NC}"
echo -e "${YELLOW}Dans la console du navigateur, tapez :${NC}"
echo -e "${GREEN}   localStorage.clear()${NC}"
echo -e "${YELLOW}Puis rechargez la page (F5)${NC}"

echo -e "\n${BLUE}6. Test de l'inscription...${NC}"
echo -e "${YELLOW}1. Cliquez sur 'Create your account'${NC}"
echo -e "${YELLOW}2. Remplissez le formulaire${NC}"
echo -e "${YELLOW}3. Cliquez sur 'Create Account'${NC}"
echo -e "${YELLOW}4. Vérifiez la redirection vers la page d'accueil${NC}"

echo -e "\n${GREEN}🎉 Test terminé !${NC}"

echo -e "\n${BLUE}📋 Prochaines étapes :${NC}"
echo -e "   ${YELLOW}1. Testez l'application dans le navigateur${NC}"
echo -e "   ${YELLOW}2. Vérifiez la console pour les erreurs${NC}"
echo -e "   ${YELLOW}3. Nettoyez le localStorage si nécessaire${NC}"
echo -e "   ${YELLOW}4. Testez l'inscription${NC}"

echo -e "\n${BLUE}🔗 URL de test :${NC}"
echo -e "   ${GREEN}http://localhost:${PORT}${NC}"

echo -e "\n${BLUE}🔗 URL d'inscription :${NC}"
echo -e "   ${GREEN}http://localhost:${PORT}/register${NC}"

echo -e "\n${PURPLE}✨ L'application devrait maintenant fonctionner !${NC}" 