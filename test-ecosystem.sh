#!/bin/bash

# Script de test pour valider l'écosystème HR Dashboard
# Auteur: Assistant IA

echo "🧪 Test de l'écosystème HR Dashboard..."

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

# Fonction pour tester un service
test_service() {
    local service_name=$1
    local url=$2
    local expected_content=$3
    
    echo -e "\n${BLUE}🔍 Test de $service_name...${NC}"
    echo -e "URL: $url"
    
    if curl -s "$url" > /dev/null; then
        echo -e "${GREEN}✅ $service_name accessible${NC}"
        
        if [ ! -z "$expected_content" ]; then
            if curl -s "$url" | grep -q "$expected_content"; then
                echo -e "${GREEN}✅ Contenu attendu trouvé${NC}"
                return 0
            else
                echo -e "${YELLOW}⚠️  Contenu attendu non trouvé${NC}"
                return 1
            fi
        fi
        return 0
    else
        echo -e "${RED}❌ $service_name non accessible${NC}"
        return 1
    fi
}

# Test des ports
print_title "TEST DES PORTS"

echo -e "${BLUE}🔍 Vérification des ports utilisés...${NC}"

# Port 80 (Nginx)
if sudo lsof -i :80 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Port 80 (Nginx) en écoute${NC}"
else
    echo -e "${RED}❌ Port 80 (Nginx) non en écoute${NC}"
fi

# Port 5173 (Frontend)
if lsof -i :5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Port 5173 (Frontend) en écoute${NC}"
else
    echo -e "${RED}❌ Port 5173 (Frontend) non en écoute${NC}"
fi

# Port 8000 (Backend)
if lsof -i :8000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Port 8000 (Backend) en écoute${NC}"
else
    echo -e "${RED}❌ Port 8000 (Backend) non en écoute${NC}"
fi

# Test des services
print_title "TEST DES SERVICES"

# Test du health check
test_service "Health Check" "http://localhost:80/health" "healthy"

# Test du frontend via Nginx
test_service "Frontend via Nginx" "http://localhost:80" "react"

# Test du frontend direct
test_service "Frontend direct" "http://localhost:5173" "react"

# Test du backend via Nginx
test_service "Backend via Nginx" "http://localhost:80/api/" "Laravel"

# Test du backend direct
test_service "Backend direct" "http://localhost:8000" "Laravel"

# Test des performances
print_title "TEST DE PERFORMANCE"

echo -e "${BLUE}⏱️  Test de temps de réponse...${NC}"

# Test du temps de réponse du frontend
FRONTEND_TIME=$(curl -s -w "%{time_total}" -o /dev/null http://localhost:80)
echo -e "Frontend via Nginx: ${GREEN}${FRONTEND_TIME}s${NC}"

# Test du temps de réponse du backend
BACKEND_TIME=$(curl -s -w "%{time_total}" -o /dev/null http://localhost:80/api/)
echo -e "Backend via Nginx:  ${GREEN}${BACKEND_TIME}s${NC}"

# Test des logs
print_title "VÉRIFICATION DES LOGS"

echo -e "${BLUE}📋 Vérification des logs Nginx...${NC}"

if [ -f "/opt/homebrew/var/log/nginx/hr-dashboard-error.log" ]; then
    ERROR_COUNT=$(sudo wc -l < /opt/homebrew/var/log/nginx/hr-dashboard-error.log)
    echo -e "Logs d'erreur Nginx: ${YELLOW}$ERROR_COUNT lignes${NC}"
    
    if [ $ERROR_COUNT -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Dernières erreurs:${NC}"
        sudo tail -3 /opt/homebrew/var/log/nginx/hr-dashboard-error.log
    else
        echo -e "${GREEN}✅ Aucune erreur dans les logs${NC}"
    fi
else
    echo -e "${RED}❌ Fichier de logs d'erreur non trouvé${NC}"
fi

if [ -f "/opt/homebrew/var/log/nginx/hr-dashboard-access.log" ]; then
    ACCESS_COUNT=$(sudo wc -l < /opt/homebrew/var/log/nginx/hr-dashboard-access.log)
    echo -e "Logs d'accès Nginx: ${YELLOW}$ACCESS_COUNT lignes${NC}"
else
    echo -e "${RED}❌ Fichier de logs d'accès non trouvé${NC}"
fi

# Test de la configuration
print_title "VÉRIFICATION DE LA CONFIGURATION"

echo -e "${BLUE}🔧 Test de la configuration Nginx...${NC}"
if sudo nginx -t > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Configuration Nginx valide${NC}"
else
    echo -e "${RED}❌ Configuration Nginx invalide${NC}"
fi

# Test des processus
print_title "VÉRIFICATION DES PROCESSUS"

echo -e "${BLUE}📊 Vérification des processus...${NC}"

# Nginx
NGINX_PIDS=$(sudo pgrep nginx | wc -l)
echo -e "Processus Nginx: ${GREEN}$NGINX_PIDS${NC}"

# Node.js (Frontend)
NODE_PIDS=$(pgrep node | wc -l)
echo -e "Processus Node.js: ${GREEN}$NODE_PIDS${NC}"

# PHP (Backend)
PHP_PIDS=$(pgrep php | wc -l)
echo -e "Processus PHP: ${GREEN}$PHP_PIDS${NC}"

# Résumé final
print_title "RÉSUMÉ DES TESTS"

echo -e "${GREEN}🎉 Tests terminés!${NC}"
echo -e "\n${BLUE}📋 URLs d'accès:${NC}"
echo -e "   ${GREEN}Application principale: http://localhost:80${NC}"
echo -e "   ${GREEN}Frontend React:        http://localhost:5173${NC}"
echo -e "   ${GREEN}Backend Laravel:       http://localhost:8000${NC}"
echo -e "   ${GREEN}Health check:          http://localhost:80/health${NC}"

echo -e "\n${BLUE}🔧 Commandes utiles:${NC}"
echo -e "   ${YELLOW}Arrêter l'écosystème: ./stop-all.sh${NC}"
echo -e "   ${YELLOW}Redémarrer:           ./start-all.sh${NC}"
echo -e "   ${YELLOW}Logs Nginx:           sudo tail -f /opt/homebrew/var/log/nginx/hr-dashboard-error.log${NC}"

echo -e "\n${PURPLE}✨ L'écosystème est opérationnel!${NC}" 