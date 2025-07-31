#!/bin/bash

echo "🔧 Correction de la page blanche..."
echo "=================================="

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

echo -e "\n${BLUE}2. Correction du service d'authentification...${NC}"
if grep -q "Version simplifiée pour éviter les erreurs de connexion" src/services/authService.js; then
    echo -e "${GREEN}✅ Service d'authentification corrigé${NC}"
else
    echo -e "${RED}❌ Service d'authentification non corrigé${NC}"
fi

echo -e "\n${BLUE}3. Instructions pour corriger la page blanche :${NC}"
echo -e "${YELLOW}1. Ouvrez votre navigateur${NC}"
echo -e "${YELLOW}2. Allez sur http://localhost:${PORT}${NC}"
echo -e "${YELLOW}3. Appuyez sur F12 pour ouvrir les outils de développement${NC}"
echo -e "${YELLOW}4. Allez dans l'onglet 'Console'${NC}"
echo -e "${YELLOW}5. Tapez cette commande :${NC}"
echo -e "${GREEN}   localStorage.clear()${NC}"
echo -e "${YELLOW}6. Appuyez sur Entrée${NC}"
echo -e "${YELLOW}7. Rechargez la page (F5)${NC}"

echo -e "\n${BLUE}4. Test de la page de connexion...${NC}"
echo -e "${YELLOW}Après avoir nettoyé le localStorage, vous devriez voir :${NC}"
echo -e "${GREEN}   • La page de connexion avec le formulaire${NC}"
echo -e "${GREEN}   • Le bouton 'Continue with Google'${NC}"
echo -e "${GREEN}   • Le lien 'Create your account'${NC}"

echo -e "\n${BLUE}5. Test de l'inscription...${NC}"
echo -e "${YELLOW}1. Cliquez sur 'Create your account'${NC}"
echo -e "${YELLOW}2. Remplissez le formulaire d'inscription${NC}"
echo -e "${YELLOW}3. Cliquez sur 'Create Account'${NC}"
echo -e "${YELLOW}4. Vous devriez être redirigé vers la page d'accueil${NC}"

echo -e "\n${BLUE}6. Test de la page d'accueil...${NC}"
echo -e "${YELLOW}Sur la page d'accueil, vous devriez voir :${NC}"
echo -e "${GREEN}   • Votre nom et prénom${NC}"
echo -e "${GREEN}   • Votre entreprise${NC}"
echo -e "${GREEN}   • Votre rôle${NC}"
echo -e "${GREEN}   • Vos initiales dans l'avatar${NC}"

echo -e "\n${BLUE}7. En cas de problème persistant...${NC}"
echo -e "${YELLOW}1. Fermez complètement le navigateur${NC}"
echo -e "${YELLOW}2. Redémarrez le serveur React :${NC}"
echo -e "${GREEN}   Ctrl+C (pour arrêter le serveur)${NC}"
echo -e "${GREEN}   pnpm dev (pour redémarrer)${NC}"
echo -e "${YELLOW}3. Ouvrez un nouvel onglet et allez sur http://localhost:${PORT}${NC}"

echo -e "\n${BLUE}8. Vérification des erreurs...${NC}"
echo -e "${YELLOW}Si la page reste blanche :${NC}"
echo -e "${YELLOW}• Vérifiez la console pour les erreurs JavaScript${NC}"
echo -e "${YELLOW}• Assurez-vous que tous les fichiers sont sauvegardés${NC}"
echo -e "${YELLOW}• Vérifiez que le serveur React fonctionne${NC}"

echo -e "\n${GREEN}🎉 Instructions de correction terminées !${NC}"

echo -e "\n${BLUE}📋 Prochaines étapes :${NC}"
echo -e "   ${YELLOW}1. Nettoyez le localStorage dans le navigateur${NC}"
echo -e "   ${YELLOW}2. Rechargez la page${NC}"
echo -e "   ${YELLOW}3. Testez l'inscription${NC}"
echo -e "   ${YELLOW}4. Vérifiez que la page d'accueil s'affiche${NC}"

echo -e "\n${BLUE}🔗 URLs importantes :${NC}"
echo -e "   ${GREEN}• Connexion : http://localhost:${PORT}${NC}"
echo -e "   ${GREEN}• Inscription : http://localhost:${PORT}/register${NC}"
echo -e "   ${GREEN}• Page d'accueil : http://localhost:${PORT}/${NC}"

echo -e "\n${PURPLE}✨ La page blanche devrait maintenant être corrigée !${NC}" 