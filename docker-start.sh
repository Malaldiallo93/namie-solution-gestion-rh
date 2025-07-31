#!/bin/bash

# Script pour démarrer l'écosystème Docker HR Dashboard
# Auteur: Assistant IA

echo "🐳 Démarrage de l'écosystème Docker HR Dashboard..."

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

print_title "VÉRIFICATION DE DOCKER"

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé${NC}"
    echo -e "${YELLOW}💡 Installez Docker Desktop depuis https://www.docker.com/products/docker-desktop${NC}"
    exit 1
fi

# Vérifier si Docker daemon est démarré
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker daemon n'est pas démarré${NC}"
    echo -e "${YELLOW}💡 Démarrez Docker Desktop et réessayez${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker est disponible${NC}"

print_title "ARRÊT DES CONTENEURS EXISTANTS"

echo -e "${BLUE}🛑 Arrêt des conteneurs existants...${NC}"
docker-compose down --remove-orphans

print_title "CONSTRUCTION DES IMAGES"

echo -e "${BLUE}🔨 Construction des images Docker...${NC}"
docker-compose build --no-cache

print_title "DÉMARRAGE DES SERVICES"

echo -e "${BLUE}🚀 Démarrage de l'écosystème...${NC}"
docker-compose up -d

echo -e "\n${BLUE}⏳ Attente du démarrage des services...${NC}"
sleep 30

print_title "VÉRIFICATION DES SERVICES"

echo -e "${BLUE}📊 Vérification du statut des conteneurs...${NC}"
docker-compose ps

echo -e "\n${BLUE}🏥 Vérification des health checks...${NC}"

# Test API Gateway
if curl -s http://localhost:8080/health | grep -q "healthy"; then
    echo -e "${GREEN}✅ API Gateway: http://localhost:8080/health${NC}"
else
    echo -e "${RED}❌ API Gateway: Non accessible${NC}"
fi

# Test Frontend
if curl -s http://localhost:80 | grep -q "html"; then
    echo -e "${GREEN}✅ Frontend: http://localhost:80${NC}"
else
    echo -e "${RED}❌ Frontend: Non accessible${NC}"
fi

# Test Backend
if curl -s http://localhost:8000/api/health | grep -q "healthy"; then
    echo -e "${GREEN}✅ Backend: http://localhost:8000/api/health${NC}"
else
    echo -e "${RED}❌ Backend: Non accessible${NC}"
fi

# Test MySQL
if docker exec hr-mysql mysqladmin ping -h localhost &> /dev/null; then
    echo -e "${GREEN}✅ MySQL: localhost:3306${NC}"
else
    echo -e "${RED}❌ MySQL: Non accessible${NC}"
fi

# Test Redis
if docker exec hr-redis redis-cli ping | grep -q "PONG"; then
    echo -e "${GREEN}✅ Redis: localhost:6379${NC}"
else
    echo -e "${RED}❌ Redis: Non accessible${NC}"
fi

echo -e "\n${BLUE}🔍 Test du service discovery...${NC}"
if curl -s http://localhost:8080/services | grep -q "services"; then
    echo -e "${GREEN}✅ Service Discovery: http://localhost:8080/services${NC}"
else
    echo -e "${RED}❌ Service Discovery: Non accessible${NC}"
fi

print_title "MIGRATION DE LA BASE DE DONNÉES"

echo -e "${BLUE}🗄️  Exécution des migrations...${NC}"
docker exec hr-backend php artisan migrate --force

echo -e "${BLUE}🌱 Exécution des seeders...${NC}"
docker exec hr-backend php artisan db:seed --force

print_title "RÉSUMÉ"

echo -e "${GREEN}🎉 Écosystème Docker HR Dashboard démarré avec succès!${NC}"

echo -e "\n${BLUE}📋 URLs d'accès:${NC}"
echo -e "   ${GREEN}Frontend:           http://localhost:80${NC}"
echo -e "   ${GREEN}Backend API:        http://localhost:8000${NC}"
echo -e "   ${GREEN}API Gateway:        http://localhost:8080${NC}"
echo -e "   ${GREEN}MySQL:              localhost:3306${NC}"
echo -e "   ${GREEN}Redis:              localhost:6379${NC}"

echo -e "\n${BLUE}🔧 Commandes utiles:${NC}"
echo -e "   ${YELLOW}Arrêter:            docker-compose down${NC}"
echo -e "   ${YELLOW}Logs:               docker-compose logs -f${NC}"
echo -e "   ${YELLOW}Redémarrer:         docker-compose restart${NC}"
echo -e "   ${YELLOW}Rebuild:            docker-compose up --build${NC}"
echo -e "   ${YELLOW}Shell Backend:      docker exec -it hr-backend sh${NC}"
echo -e "   ${YELLOW}Shell MySQL:        docker exec -it hr-mysql mysql -u hr_user -p hr_dashboard${NC}"

echo -e "\n${BLUE}📊 Test rapide:${NC}"
echo -e "   ${YELLOW}curl http://localhost:8000/api/health${NC}"
echo -e "   ${YELLOW}curl http://localhost:8000/api/employees${NC}"
echo -e "   ${YELLOW}curl http://localhost:8000/api/dashboard/metrics${NC}"

echo -e "\n${PURPLE}✨ L'application est prête à être utilisée!${NC}" 