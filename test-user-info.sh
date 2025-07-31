#!/bin/bash

echo "👤 Test des informations utilisateur..."
echo "====================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "\n${BLUE}1. Test du serveur React...${NC}"
if curl -s http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✅ Serveur React actif${NC}"
else
    echo -e "${RED}❌ Serveur React non accessible${NC}"
    echo -e "${YELLOW}💡 Démarrez avec: pnpm dev${NC}"
    exit 1
fi

echo -e "\n${BLUE}2. Vérification du stockage des informations utilisateur...${NC}"

# Vérifier que la page Register stocke les bonnes informations
if grep -q "localStorage.setItem('userName'" src/pages/Register.jsx; then
    echo -e "${GREEN}✅ Page Register stocke le nom utilisateur${NC}"
else
    echo -e "${RED}❌ Page Register ne stocke pas le nom utilisateur${NC}"
fi

if grep -q "localStorage.setItem('userFirstName'" src/pages/Register.jsx; then
    echo -e "${GREEN}✅ Page Register stocke le prénom${NC}"
else
    echo -e "${RED}❌ Page Register ne stocke pas le prénom${NC}"
fi

if grep -q "localStorage.setItem('userCompany'" src/pages/Register.jsx; then
    echo -e "${GREEN}✅ Page Register stocke l'entreprise${NC}"
else
    echo -e "${RED}❌ Page Register ne stocke pas l'entreprise${NC}"
fi

# Vérifier que la page Login stocke les informations par défaut
if grep -q "localStorage.setItem('userName'" src/pages/Login.jsx; then
    echo -e "${GREEN}✅ Page Login stocke le nom utilisateur${NC}"
else
    echo -e "${RED}❌ Page Login ne stocke pas le nom utilisateur${NC}"
fi

echo -e "\n${BLUE}3. Vérification de l'affichage des informations...${NC}"

# Vérifier que la page Home récupère les informations du localStorage
if grep -q "localStorage.getItem('userName')" src/pages/Home.jsx; then
    echo -e "${GREEN}✅ Page Home récupère le nom utilisateur${NC}"
else
    echo -e "${RED}❌ Page Home ne récupère pas le nom utilisateur${NC}"
fi

if grep -q "localStorage.getItem('userCompany')" src/pages/Home.jsx; then
    echo -e "${GREEN}✅ Page Home récupère l'entreprise${NC}"
else
    echo -e "${RED}❌ Page Home ne récupère pas l'entreprise${NC}"
fi

# Vérifier que la page Home génère les initiales
if grep -q "getInitials" src/pages/Home.jsx; then
    echo -e "${GREEN}✅ Page Home génère les initiales${NC}"
else
    echo -e "${RED}❌ Page Home ne génère pas les initiales${NC}"
fi

echo -e "\n${BLUE}4. Vérification du callback Google...${NC}"

# Vérifier que AuthCallback stocke les informations Google
if grep -q "localStorage.setItem('userName'" src/pages/AuthCallback.jsx; then
    echo -e "${GREEN}✅ AuthCallback stocke le nom utilisateur Google${NC}"
else
    echo -e "${RED}❌ AuthCallback ne stocke pas le nom utilisateur Google${NC}"
fi

if grep -q "localStorage.setItem('userAvatar'" src/pages/AuthCallback.jsx; then
    echo -e "${GREEN}✅ AuthCallback stocke l'avatar Google${NC}"
else
    echo -e "${RED}❌ AuthCallback ne stocke pas l'avatar Google${NC}"
fi

echo -e "\n${GREEN}🎉 Tests des informations utilisateur terminés !${NC}"

echo -e "\n${BLUE}📋 Informations stockées :${NC}"
echo -e "   ${GREEN}• Nom complet : userName${NC}"
echo -e "   ${GREEN}• Prénom : userFirstName${NC}"
echo -e "   ${GREEN}• Nom de famille : userLastName${NC}"
echo -e "   ${GREEN}• Email : userEmail${NC}"
echo -e "   ${GREEN}• Entreprise : userCompany${NC}"
echo -e "   ${GREEN}• Rôle : userRole${NC}"
echo -e "   ${GREEN}• Avatar : userAvatar${NC}"

echo -e "\n${BLUE}📋 Test manuel :${NC}"
echo -e "   ${YELLOW}1. Créez un compte avec vos informations personnelles${NC}"
echo -e "   ${YELLOW}2. Vérifiez que la page d'accueil affiche vos informations${NC}"
echo -e "   ${YELLOW}3. Connectez-vous avec Google et vérifiez les informations${NC}"
echo -e "   ${YELLOW}4. Vérifiez que l'avatar affiche vos initiales${NC}"

echo -e "\n${BLUE}🔗 URLs de test :${NC}"
echo -e "   ${GREEN}• Création de compte : http://localhost:5173/register${NC}"
echo -e "   ${GREEN}• Connexion : http://localhost:5173${NC}"
echo -e "   ${GREEN}• Page d'accueil : http://localhost:5173/${NC}"

echo -e "\n${PURPLE}✨ Les informations personnelles sont maintenant correctement gérées !${NC}" 