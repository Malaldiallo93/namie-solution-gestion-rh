#!/bin/bash

# Script pour arrêter tous les microservices de l'application HR Dashboard
# Auteur: Assistant IA

echo "🛑 Arrêt des microservices HR Dashboard..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour arrêter un service
stop_service() {
    local service_name=$1
    local pid_file=".$service_name.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        echo -e "\n${BLUE}🛑 Arrêt de $service_name (PID: $pid)...${NC}"
        
        if kill -0 $pid 2>/dev/null; then
            kill $pid
            sleep 2
            
            if kill -0 $pid 2>/dev/null; then
                echo -e "${YELLOW}⚠️  Force kill de $service_name...${NC}"
                kill -9 $pid
            fi
            
            echo -e "${GREEN}✅ $service_name arrêté${NC}"
        else
            echo -e "${YELLOW}⚠️  $service_name n'était pas en cours d'exécution${NC}"
        fi
        
        rm -f "$pid_file"
    else
        echo -e "${YELLOW}⚠️  Fichier PID pour $service_name non trouvé${NC}"
    fi
}

# Arrêter les services
stop_service "frontend"
stop_service "backend"

# Arrêter les processus sur les ports spécifiques
echo -e "\n${BLUE}🔍 Nettoyage des ports...${NC}"

# Port 5173 (Frontend)
pids_5173=$(lsof -ti:5173 2>/dev/null)
if [ ! -z "$pids_5173" ]; then
    echo -e "${YELLOW}⚠️  Arrêt des processus sur le port 5173...${NC}"
    echo $pids_5173 | xargs kill -9
fi

# Port 8000 (Backend)
pids_8000=$(lsof -ti:8000 2>/dev/null)
if [ ! -z "$pids_8000" ]; then
    echo -e "${YELLOW}⚠️  Arrêt des processus sur le port 8000...${NC}"
    echo $pids_8000 | xargs kill -9
fi

# Vérifier que les ports sont libres
echo -e "\n${BLUE}📊 Vérification des ports:${NC}"

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

echo -e "\n${GREEN}🎉 Tous les services ont été arrêtés!${NC}" 