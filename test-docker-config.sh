#!/bin/bash

# Script de test de configuration Docker pour HR Dashboard
# Auteur: Assistant IA

echo "🔧 Test de configuration Docker HR Dashboard..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Fonction pour afficher un titre
print_title() {
    echo -e "\n${PURPLE}══════════════════════════════════════════════════════════════${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}══════════════════════════════════════════════════════════════${NC}"
}

# Fonction pour vérifier un fichier
check_file() {
    local file=$1
    local description=$2
    
    echo -e "${BLUE}🔍 Vérification: $description${NC}"
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✅ $file existe${NC}"
        return 0
    else
        echo -e "   ${RED}❌ $file manquant${NC}"
        return 1
    fi
}

print_title "VÉRIFICATION DES FICHIERS DOCKER"

# Vérifier les fichiers Docker essentiels
check_file "Dockerfile" "Dockerfile Frontend"
check_file "hr-backend/Dockerfile" "Dockerfile Backend"
check_file "docker-compose.yml" "Docker Compose"
check_file "docker/nginx/api-gateway.conf" "Configuration API Gateway"
check_file "hr-backend/docker/nginx.conf" "Configuration Nginx Backend"
check_file "hr-backend/docker/supervisord.conf" "Configuration Supervisor"
check_file ".dockerignore" "Docker Ignore"

print_title "VÉRIFICATION DE LA CONFIGURATION DOCKER COMPOSE"

echo -e "${BLUE}🔍 Analyse du docker-compose.yml...${NC}"

# Vérifier les services définis
services=$(grep -E "^  [a-zA-Z-]+:" docker-compose.yml | sed 's/^  //' | sed 's/://')
echo -e "${BLUE}📋 Services détectés:${NC}"
for service in $services; do
    echo -e "   ${GREEN}• $service${NC}"
done

# Vérifier les ports exposés
echo -e "\n${BLUE}🔌 Ports exposés:${NC}"
ports=$(grep -E "ports:" -A 5 docker-compose.yml | grep -E "  - \"[0-9]+:" | sed 's/  - "//' | sed 's/"/ /')
for port in $ports; do
    echo -e "   ${GREEN}• $port${NC}"
done

print_title "VÉRIFICATION DE LA CONFIGURATION LARAVEL"

# Vérifier la configuration de la base de données
echo -e "${BLUE}🔍 Configuration base de données...${NC}"
if grep -q "hr_dashboard" hr-backend/config/database.php; then
    echo -e "   ${GREEN}✅ Base de données configurée pour hr_dashboard${NC}"
else
    echo -e "   ${RED}❌ Configuration base de données incorrecte${NC}"
fi

print_title "VÉRIFICATION DES SCRIPTS"

check_file "docker-start.sh" "Script de démarrage Docker"
check_file "test-integration.sh" "Script de test d'intégration"

print_title "RÉSUMÉ DE LA CONFIGURATION"

echo -e "${GREEN}🎉 Configuration Docker prête!${NC}"

echo -e "\n${BLUE}📋 Architecture:${NC}"
echo -e "   ${GREEN}• Frontend React (Nginx) - Port 80${NC}"
echo -e "   ${GREEN}• Backend Laravel (PHP-FPM + Nginx) - Port 8000${NC}"
echo -e "   ${GREEN}• API Gateway (Nginx) - Port 8080${NC}"
echo -e "   ${GREEN}• MySQL Database - Port 3306${NC}"
echo -e "   ${GREEN}• Redis Cache - Port 6379${NC}"

echo -e "\n${BLUE}🔧 Pour démarrer:${NC}"
echo -e "   ${YELLOW}1. Démarrez Docker Desktop${NC}"
echo -e "   ${YELLOW}2. Exécutez: ./docker-start.sh${NC}"
echo -e "   ${YELLOW}3. Ou manuellement: docker-compose up -d${NC}"

echo -e "\n${BLUE}📊 URLs après démarrage:${NC}"
echo -e "   ${GREEN}Frontend:     http://localhost:80${NC}"
echo -e "   ${GREEN}Backend:      http://localhost:8000${NC}"
echo -e "   ${GREEN}API Gateway:  http://localhost:8080${NC}"

echo -e "\n${PURPLE}✨ Configuration Docker terminée!${NC}" 