#!/bin/bash

# Script pour arrêter tout l'écosystème HR Dashboard
# Auteur: Assistant IA

echo "🛑 Arrêt de l'écosystème HR Dashboard..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Fonction pour afficher un titre
print_title() {
    echo -e "\n${PURPLE}══════════════════════════════════════════════════════════════${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}══════════════════════════════════════════════════════════════${NC}"
}

# Arrêt de Nginx
print_title "ARRÊT DE NGINX"

echo -e "${BLUE}🛑 Arrêt de Nginx...${NC}"
if sudo nginx -s quit 2>/dev/null; then
    echo -e "${GREEN}✅ Nginx arrêté${NC}"
else
    echo -e "${YELLOW}⚠️  Nginx n'était pas en cours d'exécution${NC}"
fi

# Arrêt des microservices
print_title "ARRÊT DES MICROSERVICES"

# Arrêter Frontend
if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    echo -e "${BLUE}🛑 Arrêt du Frontend (PID: $FRONTEND_PID)...${NC}"
    
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        sleep 2
        
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            echo -e "${YELLOW}⚠️  Force kill du Frontend...${NC}"
            kill -9 $FRONTEND_PID
        fi
        
        echo -e "${GREEN}✅ Frontend arrêté${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend n'était pas en cours d'exécution${NC}"
    fi
    
    rm -f .frontend.pid
else
    echo -e "${YELLOW}⚠️  Fichier PID Frontend non trouvé${NC}"
fi

# Arrêter Backend
if [ -f "hr-backend/.backend.pid" ]; then
    BACKEND_PID=$(cat hr-backend/.backend.pid)
    echo -e "${BLUE}🛑 Arrêt du Backend (PID: $BACKEND_PID)...${NC}"
    
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        sleep 2
        
        if kill -0 $BACKEND_PID 2>/dev/null; then
            echo -e "${YELLOW}⚠️  Force kill du Backend...${NC}"
            kill -9 $BACKEND_PID
        fi
        
        echo -e "${GREEN}✅ Backend arrêté${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend n'était pas en cours d'exécution${NC}"
    fi
    
    rm -f hr-backend/.backend.pid
else
    echo -e "${YELLOW}⚠️  Fichier PID Backend non trouvé${NC}"
fi

# Nettoyage des ports
print_title "NETTOYAGE DES PORTS"

echo -e "${BLUE}🔍 Nettoyage des processus sur les ports...${NC}"

# Port 5173 (Frontend)
pids_5173=$(lsof -ti:5173 2>/dev/null)
if [ ! -z "$pids_5173" ]; then
    echo -e "${YELLOW}⚠️  Arrêt des processus sur le port 5173...${NC}"
    echo $pids_5173 | xargs kill -9
    echo -e "${GREEN}✅ Port 5173 libéré${NC}"
else
    echo -e "${GREEN}✅ Port 5173 déjà libre${NC}"
fi

# Port 8000 (Backend)
pids_8000=$(lsof -ti:8000 2>/dev/null)
if [ ! -z "$pids_8000" ]; then
    echo -e "${YELLOW}⚠️  Arrêt des processus sur le port 8000...${NC}"
    echo $pids_8000 | xargs kill -9
    echo -e "${GREEN}✅ Port 8000 libéré${NC}"
else
    echo -e "${GREEN}✅ Port 8000 déjà libre${NC}"
fi

# Port 80 (Nginx)
pids_80=$(lsof -ti:80 2>/dev/null)
if [ ! -z "$pids_80" ]; then
    echo -e "${YELLOW}⚠️  Arrêt des processus sur le port 80...${NC}"
    echo $pids_80 | xargs kill -9
    echo -e "${GREEN}✅ Port 80 libéré${NC}"
else
    echo -e "${GREEN}✅ Port 80 déjà libre${NC}"
fi

# Vérification finale
print_title "VÉRIFICATION FINALE"

echo -e "${BLUE}📊 Vérification des ports:${NC}"

if lsof -i :5173 >/dev/null 2>&1; then
    echo -e "${RED}❌ Le port 5173 est encore utilisé${NC}"
else
    echo -e "${GREEN}✅ Le port 5173 est libre${NC}"
fi

if lsof -i :8000 >/dev/null 2>&1; then
    echo -e "${RED}❌ Le port 8000 est encore utilisé${NC}"
else
    echo -e "${GREEN}✅ Le port 8000 est libre${NC}"
fi

if lsof -i :80 >/dev/null 2>&1; then
    echo -e "${RED}❌ Le port 80 est encore utilisé${NC}"
else
    echo -e "${GREEN}✅ Le port 80 est libre${NC}"
fi

# Nettoyage des fichiers temporaires
echo -e "\n${BLUE}🧹 Nettoyage des fichiers temporaires...${NC}"
rm -f .*.pid
rm -f hr-backend/.*.pid

print_title "RÉSUMÉ"

echo -e "${GREEN}🎉 Tous les services ont été arrêtés avec succès!${NC}"
echo -e "\n${BLUE}📋 Services arrêtés:${NC}"
echo -e "   ${GREEN}✅ Nginx Reverse Proxy${NC}"
echo -e "   ${GREEN}✅ Frontend React${NC}"
echo -e "   ${GREEN}✅ Backend Laravel${NC}"
echo -e "\n${YELLOW}💡 Pour redémarrer: ./start-all.sh${NC}" 