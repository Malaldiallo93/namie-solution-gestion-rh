#!/bin/bash

echo "🔍 Debug du processus d'inscription..."
echo "====================================="

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

echo -e "\n${BLUE}2. Vérification de la page d'inscription...${NC}"
if curl -s "http://localhost:${PORT}/register" | grep -q "Create your account"; then
    echo -e "${GREEN}✅ Page d'inscription accessible${NC}"
else
    echo -e "${RED}❌ Page d'inscription non accessible${NC}"
fi

echo -e "\n${BLUE}3. Vérification du code Register.jsx...${NC}"

# Vérifier que onRegister est appelé
if grep -q "onRegister()" src/pages/Register.jsx; then
    echo -e "${GREEN}✅ onRegister() appelé dans Register.jsx${NC}"
else
    echo -e "${RED}❌ onRegister() non appelé dans Register.jsx${NC}"
fi

# Vérifier que les données sont stockées
if grep -q "localStorage.setItem('authToken'" src/pages/Register.jsx; then
    echo -e "${GREEN}✅ authToken stocké dans localStorage${NC}"
else
    echo -e "${RED}❌ authToken non stocké dans localStorage${NC}"
fi

if grep -q "localStorage.setItem('userEmail'" src/pages/Register.jsx; then
    echo -e "${GREEN}✅ userEmail stocké dans localStorage${NC}"
else
    echo -e "${RED}❌ userEmail non stocké dans localStorage${NC}"
fi

echo -e "\n${BLUE}4. Vérification du service d'authentification...${NC}"

# Vérifier que checkAuthStatus fonctionne
if grep -q "localStorage.getItem('authToken')" src/services/authService.js; then
    echo -e "${GREEN}✅ checkAuthStatus vérifie authToken${NC}"
else
    echo -e "${RED}❌ checkAuthStatus ne vérifie pas authToken${NC}"
fi

echo -e "\n${BLUE}5. Vérification de la logique App.jsx...${NC}"

# Vérifier que forceAuthCheck est présent
if grep -q "forceAuthCheck" src/App.jsx; then
    echo -e "${GREEN}✅ forceAuthCheck présent dans App.jsx${NC}"
else
    echo -e "${RED}❌ forceAuthCheck manquant dans App.jsx${NC}"
fi

# Vérifier que onRegister utilise forceAuthCheck
if grep -q "onRegister={forceAuthCheck}" src/App.jsx; then
    echo -e "${GREEN}✅ onRegister utilise forceAuthCheck${NC}"
else
    echo -e "${RED}❌ onRegister n'utilise pas forceAuthCheck${NC}"
fi

echo -e "\n${BLUE}6. Instructions de test manuel...${NC}"
echo -e "${YELLOW}1. Ouvrez votre navigateur${NC}"
echo -e "${YELLOW}2. Allez sur http://localhost:${PORT}${NC}"
echo -e "${YELLOW}3. Appuyez sur F12 pour ouvrir les outils de développement${NC}"
echo -e "${YELLOW}4. Allez dans l'onglet 'Console'${NC}"
echo -e "${YELLOW}5. Tapez : localStorage.clear()${NC}"
echo -e "${YELLOW}6. Rechargez la page (F5)${NC}"
echo -e "${YELLOW}7. Cliquez sur 'Create your account'${NC}"
echo -e "${YELLOW}8. Remplissez le formulaire et cliquez sur 'Create Account'${NC}"
echo -e "${YELLOW}9. Vérifiez la console pour les messages de debug${NC}"

echo -e "\n${BLUE}7. Messages de debug à surveiller...${NC}"
echo -e "${YELLOW}Dans la console, vous devriez voir :${NC}"
echo -e "${GREEN}   • 'Tentative d'inscription: {...}'${NC}"
echo -e "${GREEN}   • 'Inscription réussie: {...}'${NC}"
echo -e "${GREEN}   • Redirection vers la page d'accueil${NC}"

echo -e "\n${BLUE}8. Vérification du localStorage après inscription...${NC}"
echo -e "${YELLOW}Après l'inscription, vérifiez dans la console :${NC}"
echo -e "${GREEN}   localStorage.getItem('authToken')${NC}"
echo -e "${GREEN}   localStorage.getItem('userEmail')${NC}"
echo -e "${GREEN}   localStorage.getItem('userName')${NC}"

echo -e "\n${BLUE}9. Test de l'état d'authentification...${NC}"
echo -e "${YELLOW}Dans la console, testez :${NC}"
echo -e "${GREEN}   authService.checkAuthStatus()${NC}"
echo -e "${GREEN}   authService.isAuthenticated()${NC}"

echo -e "\n${GREEN}🎉 Debug de l'inscription terminé !${NC}"

echo -e "\n${BLUE}📋 Prochaines étapes :${NC}"
echo -e "   ${YELLOW}1. Testez l'inscription dans le navigateur${NC}"
echo -e "   ${YELLOW}2. Surveillez la console pour les erreurs${NC}"
echo -e "   ${YELLOW}3. Vérifiez le localStorage après inscription${NC}"
echo -e "   ${YELLOW}4. Testez l'état d'authentification${NC}"

echo -e "\n${BLUE}🔗 URLs de test :${NC}"
echo -e "   ${GREEN}• Application : http://localhost:${PORT}${NC}"
echo -e "   ${GREEN}• Inscription : http://localhost:${PORT}/register${NC}"

echo -e "\n${PURPLE}✨ Le debug vous aidera à identifier le problème d'inscription !${NC}" 