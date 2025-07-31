#!/bin/bash

# Script de nettoyage Docker pour HR Dashboard
# Auteur: Assistant IA

echo "🧹 Nettoyage de l'environnement Docker HR Dashboard..."

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

print_title "ARRÊT DES SERVICES"

echo -e "${BLUE}🛑 Arrêt des conteneurs HR Dashboard...${NC}"
docker-compose down

print_title "SUPPRESSION DES CONTENEURS"

echo -e "${BLUE}🗑️  Suppression des conteneurs...${NC}"
docker-compose down --remove-orphans

print_title "SUPPRESSION DES IMAGES"

echo -e "${BLUE}🖼️  Suppression des images...${NC}"
docker-compose down --rmi all

print_title "SUPPRESSION DES VOLUMES"

echo -e "${BLUE}💾 Suppression des volumes...${NC}"
docker volume prune -f

print_title "NETTOYAGE SYSTÈME"

echo -e "${BLUE}🧽 Nettoyage système Docker...${NC}"
docker system prune -f

print_title "VÉRIFICATION"

echo -e "${BLUE}🔍 Vérification du nettoyage...${NC}"

# Vérifier les conteneurs
containers=$(docker ps -a --filter "name=hr-" --format "{{.Names}}")
if [ -z "$containers" ]; then
    echo -e "   ${GREEN}✅ Aucun conteneur HR Dashboard trouvé${NC}"
else
    echo -e "   ${YELLOW}⚠️  Conteneurs restants:${NC}"
    echo "$containers" | while read container; do
        echo -e "      • $container"
    done
fi

# Vérifier les images
images=$(docker images --filter "reference=*hr*" --format "{{.Repository}}:{{.Tag}}")
if [ -z "$images" ]; then
    echo -e "   ${GREEN}✅ Aucune image HR Dashboard trouvée${NC}"
else
    echo -e "   ${YELLOW}⚠️  Images restantes:${NC}"
    echo "$images" | while read image; do
        echo -e "      • $image"
    done
fi

# Vérifier les volumes
volumes=$(docker volume ls --filter "name=hr" --format "{{.Name}}")
if [ -z "$volumes" ]; then
    echo -e "   ${GREEN}✅ Aucun volume HR Dashboard trouvé${NC}"
else
    echo -e "   ${YELLOW}⚠️  Volumes restants:${NC}"
    echo "$volumes" | while read volume; do
        echo -e "      • $volume"
    done
fi

print_title "RÉSUMÉ"

echo -e "${GREEN}🎉 Nettoyage terminé!${NC}"

echo -e "\n${BLUE}📋 Espace libéré:${NC}"
echo -e "   ${GREEN}• Conteneurs arrêtés et supprimés${NC}"
echo -e "   ${GREEN}• Images supprimées${NC}"
echo -e "   ${GREEN}• Volumes supprimés${NC}"
echo -e "   ${GREEN}• Cache système nettoyé${NC}"

echo -e "\n${BLUE}🔧 Pour redémarrer:${NC}"
echo -e "   ${YELLOW}./docker-start.sh${NC}"

echo -e "\n${PURPLE}✨ Environnement Docker nettoyé!${NC}" 