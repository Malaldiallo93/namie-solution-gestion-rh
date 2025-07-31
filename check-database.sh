#!/bin/bash

# Script pour vérifier la base de données MySQL
# Auteur: Assistant IA

echo "🗄️  Vérification de la base de données MySQL..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Vérifier si MySQL est installé
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ MySQL n'est pas installé${NC}"
    echo -e "${YELLOW}💡 Installez-le avec: brew install mysql${NC}"
    exit 1
fi

echo -e "${GREEN}✅ MySQL installé: $(mysql --version)${NC}"

# Lire la configuration depuis .env
ENV_FILE="hr-backend/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Fichier .env non trouvé${NC}"
    echo -e "${YELLOW}💡 Exécutez d'abord: ./configure-mysql.sh${NC}"
    exit 1
fi

# Extraire les paramètres de connexion
DB_HOST=$(grep "^DB_HOST=" "$ENV_FILE" | cut -d'=' -f2)
DB_PORT=$(grep "^DB_PORT=" "$ENV_FILE" | cut -d'=' -f2)
DB_DATABASE=$(grep "^DB_DATABASE=" "$ENV_FILE" | cut -d'=' -f2)
DB_USERNAME=$(grep "^DB_USERNAME=" "$ENV_FILE" | cut -d'=' -f2)
DB_PASSWORD=$(grep "^DB_PASSWORD=" "$ENV_FILE" | cut -d'=' -f2)

echo -e "\n${BLUE}📋 Configuration détectée:${NC}"
echo -e "   ${GREEN}Hôte: $DB_HOST${NC}"
echo -e "   ${GREEN}Port: $DB_PORT${NC}"
echo -e "   ${GREEN}Base de données: $DB_DATABASE${NC}"
echo -e "   ${GREEN}Utilisateur: $DB_USERNAME${NC}"

# Tester la connexion MySQL
echo -e "\n${BLUE}🔍 Test de connexion MySQL...${NC}"

if [ -z "$DB_PASSWORD" ]; then
    MYSQL_CMD="mysql -h $DB_HOST -P $DB_PORT -u $DB_USERNAME"
else
    MYSQL_CMD="mysql -h $DB_HOST -P $DB_PORT -u $DB_USERNAME -p$DB_PASSWORD"
fi

if $MYSQL_CMD -e "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Connexion MySQL réussie${NC}"
else
    echo -e "${RED}❌ Impossible de se connecter à MySQL${NC}"
    echo -e "${YELLOW}💡 Vérifiez vos paramètres de connexion${NC}"
    exit 1
fi

# Vérifier si la base de données existe
echo -e "\n${BLUE}🔍 Vérification de la base de données...${NC}"

if $MYSQL_CMD -e "USE $DB_DATABASE;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Base de données '$DB_DATABASE' existe${NC}"
else
    echo -e "${RED}❌ Base de données '$DB_DATABASE' n'existe pas${NC}"
    echo -e "${YELLOW}💡 Créez-la ou exécutez: ./configure-mysql.sh${NC}"
    exit 1
fi

# Lister les tables
echo -e "\n${BLUE}📊 Tables dans la base de données:${NC}"

TABLES=$($MYSQL_CMD -e "SHOW TABLES FROM $DB_DATABASE;" 2>/dev/null | tail -n +2)

if [ -z "$TABLES" ]; then
    echo -e "${YELLOW}⚠️  Aucune table trouvée${NC}"
    echo -e "${YELLOW}💡 Exécutez les migrations: cd hr-backend && php artisan migrate${NC}"
else
    echo -e "${GREEN}✅ Tables trouvées:${NC}"
    echo "$TABLES" | while read table; do
        echo -e "   ${GREEN}- $table${NC}"
    done
fi

# Vérifier la connexion Laravel
echo -e "\n${BLUE}🔍 Test de la connexion Laravel...${NC}"

cd hr-backend

if php artisan tinker --execute="DB::connection()->getPdo();" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Connexion Laravel à MySQL réussie${NC}"
else
    echo -e "${RED}❌ Erreur de connexion Laravel à MySQL${NC}"
    echo -e "${YELLOW}💡 Vérifiez la configuration dans .env${NC}"
    cd ..
    exit 1
fi

# Vérifier le statut des migrations
echo -e "\n${BLUE}🔄 Statut des migrations:${NC}"

MIGRATION_STATUS=$(php artisan migrate:status 2>/dev/null)

if echo "$MIGRATION_STATUS" | grep -q "No migrations found"; then
    echo -e "${YELLOW}⚠️  Aucune migration trouvée${NC}"
elif echo "$MIGRATION_STATUS" | grep -q "All migrations have been run"; then
    echo -e "${GREEN}✅ Toutes les migrations sont à jour${NC}"
else
    echo -e "${YELLOW}⚠️  Migrations en attente${NC}"
    echo "$MIGRATION_STATUS"
fi

cd ..

echo -e "\n${GREEN}🎉 Vérification de la base de données terminée!${NC}" 