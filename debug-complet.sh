#!/bin/bash

echo "🔍 Debug complet de l'application..."
echo "===================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "\n${BLUE}1. Nettoyage des processus...${NC}"
pkill -f "vite" 2>/dev/null
echo -e "${GREEN}✅ Tous les serveurs Vite arrêtés${NC}"

echo -e "\n${BLUE}2. Vérification des fichiers critiques...${NC}"

# Vérifier index.html
if [ -f "index.html" ]; then
    echo -e "${GREEN}✅ index.html présent${NC}"
    if grep -q "root" index.html; then
        echo -e "${GREEN}✅ Div root trouvé dans index.html${NC}"
    else
        echo -e "${RED}❌ Div root manquant dans index.html${NC}"
    fi
else
    echo -e "${RED}❌ index.html manquant${NC}"
fi

# Vérifier main.jsx
if [ -f "src/main.jsx" ]; then
    echo -e "${GREEN}✅ main.jsx présent${NC}"
    if grep -q "createRoot" src/main.jsx; then
        echo -e "${GREEN}✅ createRoot trouvé dans main.jsx${NC}"
    else
        echo -e "${RED}❌ createRoot manquant dans main.jsx${NC}"
    fi
else
    echo -e "${RED}❌ main.jsx manquant${NC}"
fi

# Vérifier App.jsx
if [ -f "src/App.jsx" ]; then
    echo -e "${GREEN}✅ App.jsx présent${NC}"
    if grep -q "export default" src/App.jsx; then
        echo -e "${GREEN}✅ Export default trouvé dans App.jsx${NC}"
    else
        echo -e "${RED}❌ Export default manquant dans App.jsx${NC}"
    fi
else
    echo -e "${RED}❌ App.jsx manquant${NC}"
fi

echo -e "\n${BLUE}3. Vérification des imports critiques...${NC}"

# Vérifier les imports dans App.jsx
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

if grep -q "import.*authService" src/App.jsx; then
    echo -e "${GREEN}✅ Import authService présent${NC}"
else
    echo -e "${RED}❌ Import authService manquant${NC}"
fi

echo -e "\n${BLUE}4. Vérification des composants...${NC}"

# Vérifier Home.jsx
if [ -f "src/pages/Home.jsx" ]; then
    echo -e "${GREEN}✅ Home.jsx présent${NC}"
    if grep -q "export default" src/pages/Home.jsx; then
        echo -e "${GREEN}✅ Home.jsx exporte un composant${NC}"
    else
        echo -e "${RED}❌ Home.jsx n'exporte pas de composant${NC}"
    fi
else
    echo -e "${RED}❌ Home.jsx manquant${NC}"
fi

# Vérifier Login.jsx
if [ -f "src/pages/Login.jsx" ]; then
    echo -e "${GREEN}✅ Login.jsx présent${NC}"
    if grep -q "export default" src/pages/Login.jsx; then
        echo -e "${GREEN}✅ Login.jsx exporte un composant${NC}"
    else
        echo -e "${RED}❌ Login.jsx n'exporte pas de composant${NC}"
    fi
else
    echo -e "${RED}❌ Login.jsx manquant${NC}"
fi

# Vérifier Register.jsx
if [ -f "src/pages/Register.jsx" ]; then
    echo -e "${GREEN}✅ Register.jsx présent${NC}"
    if grep -q "export default" src/pages/Register.jsx; then
        echo -e "${GREEN}✅ Register.jsx exporte un composant${NC}"
    else
        echo -e "${RED}❌ Register.jsx n'exporte pas de composant${NC}"
    fi
else
    echo -e "${RED}❌ Register.jsx manquant${NC}"
fi

echo -e "\n${BLUE}5. Vérification du service d'authentification...${NC}"

if [ -f "src/services/authService.js" ]; then
    echo -e "${GREEN}✅ authService.js présent${NC}"
    if grep -q "export default" src/services/authService.js; then
        echo -e "${GREEN}✅ authService exporté${NC}"
    else
        echo -e "${RED}❌ authService non exporté${NC}"
    fi
else
    echo -e "${RED}❌ authService.js manquant${NC}"
fi

echo -e "\n${BLUE}6. Vérification des dépendances...${NC}"

if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ package.json présent${NC}"
    if grep -q "react" package.json; then
        echo -e "${GREEN}✅ React dans les dépendances${NC}"
    else
        echo -e "${RED}❌ React manquant dans les dépendances${NC}"
    fi
    if grep -q "react-router-dom" package.json; then
        echo -e "${GREEN}✅ React Router dans les dépendances${NC}"
    else
        echo -e "${RED}❌ React Router manquant dans les dépendances${NC}"
    fi
else
    echo -e "${RED}❌ package.json manquant${NC}"
fi

echo -e "\n${BLUE}7. Démarrage du serveur en mode debug...${NC}"
echo -e "${YELLOW}Démarrage du serveur Vite...${NC}"

# Démarrer le serveur en arrière-plan
pnpm dev > vite.log 2>&1 &
VITE_PID=$!

# Attendre que le serveur démarre
sleep 5

# Vérifier si le serveur fonctionne
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Serveur actif sur le port 5173${NC}"
    PORT=5173
elif curl -s http://localhost:5177 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Serveur actif sur le port 5177${NC}"
    PORT=5177
else
    echo -e "${RED}❌ Serveur non accessible${NC}"
    echo -e "${YELLOW}Logs du serveur :${NC}"
    cat vite.log
    kill $VITE_PID 2>/dev/null
    exit 1
fi

echo -e "\n${BLUE}8. Test de la page principale...${NC}"
if curl -s "http://localhost:${PORT}/" | grep -q "Vite App"; then
    echo -e "${GREEN}✅ Page HTML chargée${NC}"
else
    echo -e "${RED}❌ Page HTML non accessible${NC}"
fi

echo -e "\n${BLUE}9. Instructions de test manuel...${NC}"
echo -e "${YELLOW}1. Ouvrez votre navigateur${NC}"
echo -e "${YELLOW}2. Allez sur http://localhost:${PORT}${NC}"
echo -e "${YELLOW}3. Appuyez sur F12 pour ouvrir les outils de développement${NC}"
echo -e "${YELLOW}4. Allez dans l'onglet 'Console'${NC}"
echo -e "${YELLOW}5. Regardez s'il y a des erreurs en rouge${NC}"
echo -e "${YELLOW}6. Notez les messages d'erreur${NC}"

echo -e "\n${BLUE}10. Nettoyage du localStorage...${NC}"
echo -e "${YELLOW}Dans la console du navigateur, tapez :${NC}"
echo -e "${GREEN}   localStorage.clear()${NC}"
echo -e "${YELLOW}Puis rechargez la page (F5)${NC}"

echo -e "\n${GREEN}🎉 Debug terminé !${NC}"

echo -e "\n${BLUE}📋 Prochaines étapes :${NC}"
echo -e "   ${YELLOW}1. Testez l'application dans le navigateur${NC}"
echo -e "   ${YELLOW}2. Vérifiez la console pour les erreurs${NC}"
echo -e "   ${YELLOW}3. Nettoyez le localStorage si nécessaire${NC}"
echo -e "   ${YELLOW}4. Si le problème persiste, consultez les logs${NC}"

echo -e "\n${BLUE}🔗 URL de test :${NC}"
echo -e "   ${GREEN}http://localhost:${PORT}${NC}"

echo -e "\n${BLUE}📄 Logs du serveur :${NC}"
echo -e "   ${YELLOW}Consultez vite.log pour les erreurs du serveur${NC}"

# Garder le serveur en vie
echo -e "\n${YELLOW}Le serveur continue de tourner en arrière-plan.${NC}"
echo -e "${YELLOW}Pour l'arrêter : kill $VITE_PID${NC}" 