#!/bin/bash

echo "📝 Test du processus d'inscription..."
echo "===================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "\n${BLUE}1. Test du serveur React...${NC}"
if curl -s http://localhost:5177 > /dev/null; then
    echo -e "${GREEN}✅ Serveur React actif sur le port 5177${NC}"
elif curl -s http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✅ Serveur React actif sur le port 5173${NC}"
else
    echo -e "${RED}❌ Serveur React non accessible${NC}"
    echo -e "${YELLOW}💡 Démarrez avec: pnpm dev${NC}"
    exit 1
fi

echo -e "\n${BLUE}2. Vérification de la page d'inscription...${NC}"
if curl -s http://localhost:5177/register | grep -q "Create your account"; then
    echo -e "${GREEN}✅ Page d'inscription accessible sur le port 5177${NC}"
elif curl -s http://localhost:5173/register | grep -q "Create your account"; then
    echo -e "${GREEN}✅ Page d'inscription accessible sur le port 5173${NC}"
else
    echo -e "${RED}❌ Page d'inscription non accessible${NC}"
fi

echo -e "\n${BLUE}3. Vérification du code d'inscription...${NC}"

# Vérifier que l'import authService est présent
if grep -q "import authService" src/pages/Register.jsx; then
    echo -e "${GREEN}✅ Import authService présent${NC}"
else
    echo -e "${RED}❌ Import authService manquant${NC}"
fi

# Vérifier que le stockage localStorage est configuré
if grep -q "localStorage.setItem('userName'" src/pages/Register.jsx; then
    echo -e "${GREEN}✅ Stockage userName configuré${NC}"
else
    echo -e "${RED}❌ Stockage userName non configuré${NC}"
fi

if grep -q "localStorage.setItem('userCompany'" src/pages/Register.jsx; then
    echo -e "${GREEN}✅ Stockage userCompany configuré${NC}"
else
    echo -e "${RED}❌ Stockage userCompany non configuré${NC}"
fi

# Vérifier que la gestion d'erreur est présente
if grep -q "catch (error)" src/pages/Register.jsx; then
    echo -e "${GREEN}✅ Gestion d'erreur présente${NC}"
else
    echo -e "${RED}❌ Gestion d'erreur manquante${NC}"
fi

echo -e "\n${BLUE}4. Vérification de la page d'accueil...${NC}"

# Vérifier que la page Home récupère les informations
if grep -q "localStorage.getItem('userName')" src/pages/Home.jsx; then
    echo -e "${GREEN}✅ Page Home récupère userName${NC}"
else
    echo -e "${RED}❌ Page Home ne récupère pas userName${NC}"
fi

if grep -q "getInitials" src/pages/Home.jsx; then
    echo -e "${GREEN}✅ Fonction getInitials présente${NC}"
else
    echo -e "${RED}❌ Fonction getInitials manquante${NC}"
fi

echo -e "\n${GREEN}🎉 Tests d'inscription terminés !${NC}"

echo -e "\n${BLUE}📋 Instructions de test manuel :${NC}"
echo -e "   ${YELLOW}1. Ouvrez http://localhost:5177/register${NC}"
echo -e "   ${YELLOW}2. Remplissez le formulaire avec vos informations${NC}"
echo -e "   ${YELLOW}3. Cliquez sur 'Create Account'${NC}"
echo -e "   ${YELLOW}4. Vérifiez que vous êtes redirigé vers la page d'accueil${NC}"
echo -e "   ${YELLOW}5. Vérifiez que vos informations sont affichées${NC}"

echo -e "\n${BLUE}🔗 URLs importantes :${NC}"
echo -e "   ${GREEN}• Inscription : http://localhost:5177/register${NC}"
echo -e "   ${GREEN}• Connexion : http://localhost:5177${NC}"
echo -e "   ${GREEN}• Page d'accueil : http://localhost:5177/${NC}"

echo -e "\n${BLUE}⚠️  En cas d'erreur :${NC}"
echo -e "   ${YELLOW}• Vérifiez la console du navigateur (F12)${NC}"
echo -e "   ${YELLOW}• Vérifiez que tous les champs sont remplis${NC}"
echo -e "   ${YELLOW}• Vérifiez que les mots de passe correspondent${NC}"
echo -e "   ${YELLOW}• Vérifiez que les conditions sont acceptées${NC}"

echo -e "\n${PURPLE}✨ L'inscription devrait maintenant fonctionner correctement !${NC}" 