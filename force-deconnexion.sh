#!/bin/bash

echo "🔄 Force déconnexion et test d'inscription..."
echo "============================================"

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

echo -e "\n${BLUE}2. Instructions pour forcer la déconnexion...${NC}"
echo -e "${YELLOW}1. Ouvrez votre navigateur${NC}"
echo -e "${YELLOW}2. Allez sur http://localhost:${PORT}${NC}"
echo -e "${YELLOW}3. Appuyez sur F12 pour ouvrir les outils de développement${NC}"
echo -e "${YELLOW}4. Allez dans l'onglet 'Console'${NC}"
echo -e "${YELLOW}5. Tapez ces commandes une par une :${NC}"

echo -e "\n${GREEN}localStorage.clear()${NC}"
echo -e "${GREEN}sessionStorage.clear()${NC}"
echo -e "${GREEN}location.reload()${NC}"

echo -e "\n${BLUE}3. Vérification de la déconnexion...${NC}"
echo -e "${YELLOW}Après avoir exécuté ces commandes, vous devriez voir :${NC}"
echo -e "${GREEN}   • La page de connexion avec formulaire${NC}"
echo -e "${GREEN}   • Le bouton 'Continue with Google'${NC}"
echo -e "${GREEN}   • Le lien 'Create your account'${NC}"

echo -e "\n${BLUE}4. Test de l'inscription...${NC}"
echo -e "${YELLOW}1. Cliquez sur 'Create your account'${NC}"
echo -e "${YELLOW}2. Remplissez le formulaire :${NC}"
echo -e "${GREEN}   • Prénom : Votre prénom${NC}"
echo -e "${GREEN}   • Nom : Votre nom${NC}"
echo -e "${GREEN}   • Email : Votre email${NC}"
echo -e "${GREEN}   • Entreprise : Votre entreprise${NC}"
echo -e "${GREEN}   • Rôle : Votre rôle${NC}"
echo -e "${GREEN}   • Mot de passe : Votre mot de passe${NC}"
echo -e "${GREEN}   • Confirmer le mot de passe : Le même mot de passe${NC}"
echo -e "${YELLOW}3. Cochez 'I agree to the Terms of Service and Privacy Policy'${NC}"
echo -e "${YELLOW}4. Cliquez sur 'Create Account'${NC}"

echo -e "\n${BLUE}5. Surveillance de la console...${NC}"
echo -e "${YELLOW}Pendant l'inscription, surveillez la console pour :${NC}"
echo -e "${GREEN}   • 'Tentative d'inscription: {...}'${NC}"
echo -e "${GREEN}   • 'Inscription réussie: {...}'${NC}"
echo -e "${GREEN}   • Redirection vers la page d'accueil${NC}"

echo -e "\n${BLUE}6. Vérification après inscription...${NC}"
echo -e "${YELLOW}Après l'inscription, vérifiez dans la console :${NC}"
echo -e "${GREEN}   localStorage.getItem('authToken')${NC}"
echo -e "${GREEN}   localStorage.getItem('userEmail')${NC}"
echo -e "${GREEN}   localStorage.getItem('userName')${NC}"
echo -e "${GREEN}   localStorage.getItem('userCompany')${NC}"
echo -e "${GREEN}   localStorage.getItem('userRole')${NC}"

echo -e "\n${BLUE}7. Test de l'état d'authentification...${NC}"
echo -e "${YELLOW}Dans la console, testez :${NC}"
echo -e "${GREEN}   authService.checkAuthStatus()${NC}"
echo -e "${GREEN}   authService.isAuthenticated()${NC}"

echo -e "\n${BLUE}8. Vérification de la page d'accueil...${NC}"
echo -e "${YELLOW}Sur la page d'accueil, vous devriez voir :${NC}"
echo -e "${GREEN}   • Votre nom et prénom${NC}"
echo -e "${GREEN}   • Votre entreprise${NC}"
echo -e "${GREEN}   • Votre rôle${NC}"
echo -e "${GREEN}   • Vos initiales dans l'avatar${NC}"

echo -e "\n${BLUE}9. En cas de problème...${NC}"
echo -e "${YELLOW}Si l'inscription ne fonctionne toujours pas :${NC}"
echo -e "${YELLOW}1. Vérifiez la console pour les erreurs${NC}"
echo -e "${YELLOW}2. Assurez-vous que tous les champs sont remplis${NC}"
echo -e "${YELLOW}3. Vérifiez que les mots de passe correspondent${NC}"
echo -e "${YELLOW}4. Vérifiez que les conditions sont acceptées${NC}"
echo -e "${YELLOW}5. Redémarrez le serveur si nécessaire${NC}"

echo -e "\n${GREEN}🎉 Instructions de force déconnexion terminées !${NC}"

echo -e "\n${BLUE}📋 Prochaines étapes :${NC}"
echo -e "   ${YELLOW}1. Forcez la déconnexion avec localStorage.clear()${NC}"
echo -e "   ${YELLOW}2. Testez l'inscription${NC}"
echo -e "   ${YELLOW}3. Surveillez la console pour les erreurs${NC}"
echo -e "   ${YELLOW}4. Vérifiez la redirection vers la page d'accueil${NC}"

echo -e "\n${BLUE}🔗 URLs importantes :${NC}"
echo -e "   ${GREEN}• Application : http://localhost:${PORT}${NC}"
echo -e "   ${GREEN}• Inscription : http://localhost:${PORT}/register${NC}"

echo -e "\n${PURPLE}✨ La force déconnexion devrait résoudre le problème d'inscription !${NC}" 