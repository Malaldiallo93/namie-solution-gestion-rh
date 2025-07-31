#!/bin/bash

# Script pour démarrer Nginx avec la configuration HR Dashboard
# Auteur: Assistant IA

echo "🌐 Démarrage de Nginx avec configuration HR Dashboard..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Vérifier si Nginx est installé
if ! command -v nginx &> /dev/null; then
    echo -e "${RED}❌ Nginx n'est pas installé${NC}"
    echo -e "${YELLOW}💡 Installez-le avec: brew install nginx${NC}"
    exit 1
fi

# Vérifier la configuration
echo -e "\n${BLUE}🔍 Vérification de la configuration Nginx...${NC}"
if sudo nginx -t; then
    echo -e "${GREEN}✅ Configuration Nginx valide${NC}"
else
    echo -e "${RED}❌ Configuration Nginx invalide${NC}"
    exit 1
fi

# Arrêter Nginx s'il est déjà en cours d'exécution
echo -e "\n${BLUE}🛑 Arrêt de Nginx s'il est en cours d'exécution...${NC}"
if sudo nginx -s quit 2>/dev/null; then
    echo -e "${GREEN}✅ Nginx arrêté${NC}"
    sleep 2
else
    echo -e "${YELLOW}⚠️  Nginx n'était pas en cours d'exécution${NC}"
fi

# Démarrer Nginx
echo -e "\n${BLUE}🚀 Démarrage de Nginx...${NC}"
if sudo nginx; then
    echo -e "${GREEN}✅ Nginx démarré avec succès${NC}"
else
    echo -e "${RED}❌ Erreur lors du démarrage de Nginx${NC}"
    exit 1
fi

# Vérifier que Nginx fonctionne
echo -e "\n${BLUE}📊 Vérification du statut Nginx...${NC}"
sleep 2

if curl -s http://localhost:80 > /dev/null; then
    echo -e "${GREEN}✅ Nginx accessible sur http://localhost:80${NC}"
else
    echo -e "${RED}❌ Nginx non accessible sur le port 80${NC}"
    echo -e "${YELLOW}💡 Vérifiez les logs: sudo tail -f /opt/homebrew/var/log/nginx/hr-dashboard-error.log${NC}"
fi

# Vérifier le health check
if curl -s http://localhost:80/health | grep -q "healthy"; then
    echo -e "${GREEN}✅ Health check réussi${NC}"
else
    echo -e "${YELLOW}⚠️  Health check échoué${NC}"
fi

echo -e "\n${GREEN}🎉 Nginx configuré et démarré!${NC}"
echo -e "${BLUE}📋 URLs d'accès:${NC}"
echo -e "   Application: ${GREEN}http://localhost:80${NC}"
echo -e "   Frontend:    ${GREEN}http://localhost:5173${NC}"
echo -e "   Backend:     ${GREEN}http://localhost:8000${NC}"
echo -e "\n${YELLOW}💡 Pour arrêter Nginx: sudo nginx -s quit${NC}"
echo -e "${YELLOW}💡 Pour recharger la config: sudo nginx -s reload${NC}" 