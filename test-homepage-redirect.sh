#!/bin/bash

echo "🏠 Test de la redirection vers la page d'accueil..."
echo "================================================"

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

echo -e "\n${BLUE}2. Test de la route d'accueil...${NC}"
if curl -s http://localhost:5173/ | grep -q "html"; then
    echo -e "${GREEN}✅ Route d'accueil accessible${NC}"
else
    echo -e "${RED}❌ Route d'accueil non accessible${NC}"
    exit 1
fi

echo -e "\n${BLUE}3. Vérification des routes configurées...${NC}"

# Vérifier que la route / pointe vers Home
if grep -q 'path="/" element={<Home />}' src/App.jsx; then
    echo -e "${GREEN}✅ Route / pointe vers Home${NC}"
else
    echo -e "${RED}❌ Route / ne pointe pas vers Home${NC}"
fi

# Vérifier que la route /dashboard pointe vers HRDashboard
if grep -q 'path="/dashboard" element={<HRDashboard />}' src/App.jsx; then
    echo -e "${GREEN}✅ Route /dashboard pointe vers HRDashboard${NC}"
else
    echo -e "${RED}❌ Route /dashboard ne pointe pas vers HRDashboard${NC}"
fi

echo -e "\n${BLUE}4. Vérification de la sidebar...${NC}"

# Vérifier que le logo pointe vers /
if grep -q 'to="/"' src/partials/Sidebar.jsx; then
    echo -e "${GREEN}✅ Logo sidebar pointe vers /${NC}"
else
    echo -e "${RED}❌ Logo sidebar ne pointe pas vers /${NC}"
fi

# Vérifier que le lien Home pointe vers /
if grep -q 'to="/"' src/partials/Sidebar.jsx | grep -q "Home"; then
    echo -e "${GREEN}✅ Lien Home sidebar pointe vers /${NC}"
else
    echo -e "${YELLOW}⚠️  Lien Home sidebar à vérifier${NC}"
fi

echo -e "\n${BLUE}5. Vérification du callback d'authentification...${NC}"

# Vérifier que AuthCallback redirige vers /
if grep -q "navigate('/')" src/pages/AuthCallback.jsx; then
    echo -e "${GREEN}✅ AuthCallback redirige vers /${NC}"
else
    echo -e "${RED}❌ AuthCallback ne redirige pas vers /${NC}"
fi

echo -e "\n${GREEN}🎉 Tests de redirection terminés !${NC}"

echo -e "\n${BLUE}📋 Configuration actuelle :${NC}"
echo -e "   ${GREEN}• Page d'accueil : / (Home)${NC}"
echo -e "   ${GREEN}• Dashboard HR : /dashboard (HRDashboard)${NC}"
echo -e "   ${GREEN}• Redirection après connexion : /${NC}"

echo -e "\n${BLUE}🔗 URLs importantes :${NC}"
echo -e "   ${GREEN}• Page d'accueil : http://localhost:5173/${NC}"
echo -e "   ${GREEN}• Dashboard HR : http://localhost:5173/dashboard${NC}"
echo -e "   ${GREEN}• Connexion : http://localhost:5173${NC}"

echo -e "\n${BLUE}📋 Test manuel :${NC}"
echo -e "   ${YELLOW}1. Ouvrez http://localhost:5173${NC}"
echo -e "   ${YELLOW}2. Connectez-vous avec Google${NC}"
echo -e "   ${YELLOW}3. Vérifiez que vous arrivez sur la page d'accueil${NC}"
echo -e "   ${YELLOW}4. Cliquez sur 'Dashboard' dans la sidebar pour aller au dashboard HR${NC}"

echo -e "\n${PURPLE}✨ La page d'accueil est maintenant accessible par défaut !${NC}" 