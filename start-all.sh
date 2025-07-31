#!/bin/bash

# Script principal pour démarrer tout l'écosystème HR Dashboard
# Auteur: Assistant IA

echo "🚀 Démarrage de l'écosystème HR Dashboard complet..."

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

# Fonction pour vérifier le statut d'un service
check_service() {
    local service_name=$1
    local url=$2
    
    if curl -s "$url" > /dev/null; then
        echo -e "${GREEN}✅ $service_name: $url${NC}"
        return 0
    else
        echo -e "${RED}❌ $service_name: Non accessible${NC}"
        return 1
    fi
}

# Vérification des prérequis
print_title "VÉRIFICATION DES PRÉREQUIS"

echo -e "${BLUE}🔍 Vérification des outils nécessaires...${NC}"

# Node.js
if command -v node &> /dev/null; then
    echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
else
    echo -e "${RED}❌ Node.js non installé${NC}"
    exit 1
fi

# PHP
if command -v php &> /dev/null; then
    echo -e "${GREEN}✅ PHP: $(php --version | head -1)${NC}"
else
    echo -e "${RED}❌ PHP non installé${NC}"
    exit 1
fi

# Composer
if command -v composer &> /dev/null; then
    echo -e "${GREEN}✅ Composer installé${NC}"
else
    echo -e "${RED}❌ Composer non installé${NC}"
    exit 1
fi

# Vérifier MySQL
if command -v mysql &> /dev/null; then
    echo -e "${GREEN}✅ MySQL installé: $(mysql --version | head -1)${NC}"
else
    echo -e "${YELLOW}⚠️  MySQL non installé - utilisez: brew install mysql${NC}"
fi

# Nginx
if command -v nginx &> /dev/null; then
    echo -e "${GREEN}✅ Nginx: $(nginx -v 2>&1)${NC}"
else
    echo -e "${RED}❌ Nginx non installé${NC}"
    exit 1
fi

# Arrêt des services existants
print_title "ARRÊT DES SERVICES EXISTANTS"

echo -e "${BLUE}🛑 Arrêt des services existants...${NC}"

# Arrêter Nginx
if sudo nginx -s quit 2>/dev/null; then
    echo -e "${GREEN}✅ Nginx arrêté${NC}"
else
    echo -e "${YELLOW}⚠️  Nginx n'était pas en cours d'exécution${NC}"
fi

# Arrêter les processus sur les ports
pids_5173=$(lsof -ti:5173 2>/dev/null)
if [ ! -z "$pids_5173" ]; then
    echo -e "${YELLOW}⚠️  Arrêt des processus sur le port 5173...${NC}"
    echo $pids_5173 | xargs kill -9
fi

pids_8000=$(lsof -ti:8000 2>/dev/null)
if [ ! -z "$pids_8000" ]; then
    echo -e "${YELLOW}⚠️  Arrêt des processus sur le port 8000...${NC}"
    echo $pids_8000 | xargs kill -9
fi

sleep 2

# Démarrage des microservices
print_title "DÉMARRAGE DES MICROSERVICES"

echo -e "${BLUE}📦 Démarrage du Frontend React...${NC}"
cd "$(dirname "$0")"
npm run dev > /dev/null 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > .frontend.pid
echo -e "${GREEN}✅ Frontend démarré (PID: $FRONTEND_PID)${NC}"

echo -e "${BLUE}📦 Démarrage du Backend Laravel...${NC}"
cd hr-backend
php artisan serve --host=127.0.0.1 --port=8000 > /dev/null 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > .backend.pid
echo -e "${GREEN}✅ Backend démarré (PID: $BACKEND_PID)${NC}"

cd ..

# Attendre que les services démarrent
echo -e "\n${BLUE}⏳ Attente du démarrage des services...${NC}"
sleep 8

# Démarrage de Nginx
print_title "DÉMARRAGE DE NGINX"

echo -e "${BLUE}🌐 Démarrage de Nginx...${NC}"
if sudo nginx; then
    echo -e "${GREEN}✅ Nginx démarré avec succès${NC}"
else
    echo -e "${RED}❌ Erreur lors du démarrage de Nginx${NC}"
fi

# Vérification finale
print_title "VÉRIFICATION FINALE"

echo -e "${BLUE}📊 Vérification du statut des services...${NC}"

# Vérifier les services
check_service "Frontend React" "http://localhost:5173"
check_service "Backend Laravel" "http://localhost:8000"
check_service "Nginx Reverse Proxy" "http://localhost:80"

# Vérifier le health check
if curl -s http://localhost:80/health | grep -q "healthy"; then
    echo -e "${GREEN}✅ Health check réussi${NC}"
else
    echo -e "${YELLOW}⚠️  Health check échoué${NC}"
fi

# Résumé final
print_title "RÉSUMÉ"

echo -e "${GREEN}🎉 Écosystème HR Dashboard démarré avec succès!${NC}"
echo -e "\n${BLUE}📋 URLs d'accès:${NC}"
echo -e "   ${GREEN}Application principale: http://localhost:80${NC}"
echo -e "   ${GREEN}Frontend React:        http://localhost:5173${NC}"
echo -e "   ${GREEN}Backend Laravel:       http://localhost:8000${NC}"
echo -e "   ${GREEN}Health check:          http://localhost:80/health${NC}"

echo -e "\n${BLUE}🔧 Commandes utiles:${NC}"
echo -e "   ${YELLOW}Arrêter tout:          ./stop-all.sh${NC}"
echo -e "   ${YELLOW}Logs Nginx:            sudo tail -f /opt/homebrew/var/log/nginx/hr-dashboard-error.log${NC}"
echo -e "   ${YELLOW}Recharger Nginx:       sudo nginx -s reload${NC}"

echo -e "\n${PURPLE}✨ L'application est prête à être utilisée!${NC}" 