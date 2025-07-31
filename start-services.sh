#!/bin/bash

# Script pour démarrer tous les microservices de l'application HR Dashboard
# Auteur: Assistant IA
# Date: $(date)

echo "🚀 Démarrage des microservices HR Dashboard..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour vérifier si un port est utilisé
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  Le port $port est déjà utilisé${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Le port $port est disponible${NC}"
        return 0
    fi
}

# Fonction pour démarrer un service
start_service() {
    local service_name=$1
    local command=$2
    local port=$3
    
    echo -e "\n${BLUE}📦 Démarrage de $service_name...${NC}"
    
    if check_port $port; then
        echo "Commande: $command"
        eval "$command" &
        local pid=$!
        echo -e "${GREEN}✅ $service_name démarré avec PID: $pid${NC}"
        echo $pid > ".$service_name.pid"
        sleep 2
    else
        echo -e "${RED}❌ Impossible de démarrer $service_name - port $port occupé${NC}"
        return 1
    fi
}

# Vérification des prérequis
echo -e "\n${BLUE}🔍 Vérification des prérequis...${NC}"

# Vérifier Node.js
if command -v node &> /dev/null; then
    echo -e "${GREEN}✅ Node.js installé: $(node --version)${NC}"
else
    echo -e "${RED}❌ Node.js non installé${NC}"
    exit 1
fi

# Vérifier PHP
if command -v php &> /dev/null; then
    echo -e "${GREEN}✅ PHP installé: $(php --version | head -1)${NC}"
else
    echo -e "${RED}❌ PHP non installé${NC}"
    exit 1
fi

# Vérifier Composer
if command -v composer &> /dev/null; then
    echo -e "${GREEN}✅ Composer installé${NC}"
else
    echo -e "${RED}❌ Composer non installé${NC}"
    exit 1
fi

# Vérifier Nginx
if command -v nginx &> /dev/null; then
    echo -e "${GREEN}✅ Nginx installé${NC}"
else
    echo -e "${YELLOW}⚠️  Nginx non installé - sera installé plus tard${NC}"
fi

# Nettoyer les anciens PIDs
echo -e "\n${BLUE}🧹 Nettoyage des anciens processus...${NC}"
rm -f .*.pid

# Démarrer le Frontend React (port 5173)
cd "$(dirname "$0")"
start_service "frontend" "npm run dev" 5173

# Démarrer le Backend Laravel (port 8000)
cd hr-backend
start_service "backend" "php artisan serve --host=127.0.0.1 --port=8000" 8000

# Retourner au répertoire racine
cd ..

# Attendre que les services démarrent
echo -e "\n${BLUE}⏳ Attente du démarrage des services...${NC}"
sleep 5

# Vérifier le statut des services
echo -e "\n${BLUE}📊 Statut des services:${NC}"

# Vérifier Frontend
if curl -s http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✅ Frontend React: http://localhost:5173${NC}"
else
    echo -e "${RED}❌ Frontend React: Non accessible${NC}"
fi

# Vérifier Backend
if curl -s http://localhost:8000 > /dev/null; then
    echo -e "${GREEN}✅ Backend Laravel: http://localhost:8000${NC}"
else
    echo -e "${RED}❌ Backend Laravel: Non accessible${NC}"
fi

echo -e "\n${GREEN}🎉 Services démarrés avec succès!${NC}"
echo -e "${BLUE}📋 URLs d'accès:${NC}"
echo -e "   Frontend: ${GREEN}http://localhost:5173${NC}"
echo -e "   Backend:  ${GREEN}http://localhost:8000${NC}"
echo -e "\n${YELLOW}💡 Pour arrêter les services: ./stop-services.sh${NC}" 