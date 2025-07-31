#!/bin/bash

echo "🔍 Diagnostic de la page blanche..."
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

echo -e "\n${BLUE}2. Test de la page principale...${NC}"
if curl -s "http://localhost:${PORT}/" | grep -q "Vite App"; then
    echo -e "${GREEN}✅ Page HTML chargée${NC}"
else
    echo -e "${RED}❌ Page HTML non accessible${NC}"
fi

echo -e "\n${BLUE}3. Vérification des fichiers principaux...${NC}"

# Vérifier que App.jsx existe
if [ -f "src/App.jsx" ]; then
    echo -e "${GREEN}✅ App.jsx présent${NC}"
else
    echo -e "${RED}❌ App.jsx manquant${NC}"
fi

# Vérifier que main.jsx existe
if [ -f "src/main.jsx" ]; then
    echo -e "${GREEN}✅ main.jsx présent${NC}"
else
    echo -e "${RED}❌ main.jsx manquant${NC}"
fi

# Vérifier que index.html existe
if [ -f "index.html" ]; then
    echo -e "${GREEN}✅ index.html présent${NC}"
else
    echo -e "${RED}❌ index.html manquant${NC}"
fi

echo -e "\n${BLUE}4. Vérification des imports dans App.jsx...${NC}"

# Vérifier les imports essentiels
if grep -q "import.*React" src/App.jsx; then
    echo -e "${GREEN}✅ Import React présent${NC}"
else
    echo -e "${RED}❌ Import React manquant${NC}"
fi

if grep -q "import.*Routes" src/App.jsx; then
    echo -e "${GREEN}✅ Import Routes présent${NC}"
else
    echo -e "${RED}❌ Import Routes manquant${NC}"
fi

if grep -q "import.*Home" src/App.jsx; then
    echo -e "${GREEN}✅ Import Home présent${NC}"
else
    echo -e "${RED}❌ Import Home manquant${NC}"
fi

echo -e "\n${BLUE}5. Vérification de la structure des routes...${NC}"

# Vérifier que la route principale existe
if grep -q 'path="/"' src/App.jsx; then
    echo -e "${GREEN}✅ Route principale / configurée${NC}"
else
    echo -e "${RED}❌ Route principale / manquante${NC}"
fi

# Vérifier que la route Home est configurée
if grep -q 'element={<Home />}' src/App.jsx; then
    echo -e "${GREEN}✅ Route Home configurée${NC}"
else
    echo -e "${RED}❌ Route Home non configurée${NC}"
fi

echo -e "\n${BLUE}6. Vérification du fichier Home.jsx...${NC}"

if [ -f "src/pages/Home.jsx" ]; then
    echo -e "${GREEN}✅ Home.jsx présent${NC}"
    
    # Vérifier que Home.jsx a du contenu
    if [ -s "src/pages/Home.jsx" ]; then
        echo -e "${GREEN}✅ Home.jsx non vide${NC}"
    else
        echo -e "${RED}❌ Home.jsx vide${NC}"
    fi
    
    # Vérifier que Home.jsx exporte un composant
    if grep -q "export default" src/pages/Home.jsx; then
        echo -e "${GREEN}✅ Home.jsx exporte un composant${NC}"
    else
        echo -e "${RED}❌ Home.jsx n'exporte pas de composant${NC}"
    fi
else
    echo -e "${RED}❌ Home.jsx manquant${NC}"
fi

echo -e "\n${BLUE}7. Vérification de l'authentification...${NC}"

# Vérifier si l'utilisateur est connecté
if grep -q "isAuthenticated" src/App.jsx; then
    echo -e "${GREEN}✅ Logique d'authentification présente${NC}"
else
    echo -e "${RED}❌ Logique d'authentification manquante${NC}"
fi

echo -e "\n${BLUE}8. Instructions de diagnostic manuel...${NC}"
echo -e "${YELLOW}1. Ouvrez votre navigateur${NC}"
echo -e "${YELLOW}2. Allez sur http://localhost:${PORT}${NC}"
echo -e "${YELLOW}3. Appuyez sur F12 pour ouvrir les outils de développement${NC}"
echo -e "${YELLOW}4. Allez dans l'onglet 'Console'${NC}"
echo -e "${YELLOW}5. Regardez s'il y a des erreurs en rouge${NC}"
echo -e "${YELLOW}6. Notez les messages d'erreur${NC}"

echo -e "\n${BLUE}9. Solutions possibles...${NC}"
echo -e "${YELLOW}• Nettoyez le localStorage : localStorage.clear()${NC}"
echo -e "${YELLOW}• Rechargez la page : F5${NC}"
echo -e "${YELLOW}• Vérifiez la console pour les erreurs JavaScript${NC}"
echo -e "${YELLOW}• Redémarrez le serveur : Ctrl+C puis pnpm dev${NC}"

echo -e "\n${GREEN}🎉 Diagnostic terminé !${NC}"

echo -e "\n${BLUE}📋 Prochaines étapes :${NC}"
echo -e "   ${YELLOW}1. Vérifiez la console du navigateur${NC}"
echo -e "   ${YELLOW}2. Nettoyez le localStorage si nécessaire${NC}"
echo -e "   ${YELLOW}3. Rechargez la page${NC}"
echo -e "   ${YELLOW}4. Si le problème persiste, redémarrez le serveur${NC}"

echo -e "\n${PURPLE}✨ Le diagnostic vous aidera à identifier la cause de la page blanche !${NC}" 