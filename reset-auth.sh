#!/bin/bash

echo "🔄 Réinitialisation de l'authentification..."
echo "==========================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "\n${BLUE}1. Test du serveur React...${NC}"
if curl -s http://localhost:5177 > /dev/null; then
    echo -e "${GREEN}✅ Serveur React actif sur le port 5177${NC}"
    PORT=5177
elif curl -s http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✅ Serveur React actif sur le port 5173${NC}"
    PORT=5173
else
    echo -e "${RED}❌ Serveur React non accessible${NC}"
    echo -e "${YELLOW}💡 Démarrez avec: pnpm dev${NC}"
    exit 1
fi

echo -e "\n${BLUE}2. Instructions pour réinitialiser l'authentification :${NC}"
echo -e "${YELLOW}1. Ouvrez votre navigateur${NC}"
echo -e "${YELLOW}2. Appuyez sur F12 pour ouvrir les outils de développement${NC}"
echo -e "${YELLOW}3. Allez dans l'onglet 'Console'${NC}"
echo -e "${YELLOW}4. Tapez cette commande :${NC}"
echo -e "${GREEN}   localStorage.clear()${NC}"
echo -e "${YELLOW}5. Appuyez sur Entrée${NC}"
echo -e "${YELLOW}6. Rechargez la page (F5)${NC}"

echo -e "\n${BLUE}3. Test de la page d'inscription...${NC}"
echo -e "${YELLOW}Après avoir nettoyé le localStorage, testez :${NC}"
echo -e "${GREEN}   http://localhost:${PORT}/register${NC}"

echo -e "\n${BLUE}4. Test de la page de connexion...${NC}"
echo -e "${GREEN}   http://localhost:${PORT}${NC}"

echo -e "\n${BLUE}5. Vérification du processus d'inscription...${NC}"
echo -e "${YELLOW}1. Remplissez le formulaire d'inscription${NC}"
echo -e "${YELLOW}2. Cliquez sur 'Create Account'${NC}"
echo -e "${YELLOW}3. Vérifiez que vous êtes redirigé vers la page d'accueil${NC}"
echo -e "${YELLOW}4. Vérifiez que vos informations sont affichées${NC}"

echo -e "\n${BLUE}6. En cas de problème...${NC}"
echo -e "${YELLOW}• Vérifiez la console du navigateur pour les erreurs${NC}"
echo -e "${YELLOW}• Assurez-vous que tous les champs sont remplis${NC}"
echo -e "${YELLOW}• Vérifiez que les mots de passe correspondent${NC}"
echo -e "${YELLOW}• Vérifiez que les conditions sont acceptées${NC}"

echo -e "\n${BLUE}7. Test rapide avec curl...${NC}"
echo -e "${YELLOW}Test de la page d'accueil :${NC}"
if curl -s "http://localhost:${PORT}/" | grep -q "html"; then
    echo -e "${GREEN}✅ Page d'accueil accessible${NC}"
else
    echo -e "${RED}❌ Page d'accueil non accessible${NC}"
fi

echo -e "\n${GREEN}🎉 Instructions de réinitialisation terminées !${NC}"

echo -e "\n${BLUE}📋 Prochaines étapes :${NC}"
echo -e "   ${YELLOW}1. Nettoyez le localStorage dans le navigateur${NC}"
echo -e "   ${YELLOW}2. Testez l'inscription sur http://localhost:${PORT}/register${NC}"
echo -e "   ${YELLOW}3. Vérifiez que l'inscription fonctionne${NC}"

echo -e "\n${PURPLE}✨ Après réinitialisation, l'inscription devrait fonctionner !${NC}" 