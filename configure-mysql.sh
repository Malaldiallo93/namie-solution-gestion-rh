#!/bin/bash

# Script pour configurer MySQL pour l'application HR Dashboard
# Auteur: Assistant IA

echo "🗄️  Configuration MySQL pour HR Dashboard..."

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

# Demander les informations de connexion
echo -e "\n${BLUE}🔧 Configuration de la base de données...${NC}"

read -p "Nom d'utilisateur MySQL (défaut: root): " DB_USERNAME
DB_USERNAME=${DB_USERNAME:-root}

read -s -p "Mot de passe MySQL (laissez vide si aucun): " DB_PASSWORD
echo

read -p "Hôte MySQL (défaut: 127.0.0.1): " DB_HOST
DB_HOST=${DB_HOST:-127.0.0.1}

read -p "Port MySQL (défaut: 3306): " DB_PORT
DB_PORT=${DB_PORT:-3306}

read -p "Nom de la base de données (défaut: data_hr): " DB_DATABASE
DB_DATABASE=${DB_DATABASE:-data_hr}

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
    echo -e "${YELLOW}⚠️  Base de données '$DB_DATABASE' n'existe pas${NC}"
    read -p "Voulez-vous la créer ? (y/n): " CREATE_DB
    
    if [[ $CREATE_DB =~ ^[Yy]$ ]]; then
        if $MYSQL_CMD -e "CREATE DATABASE $DB_DATABASE;" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Base de données '$DB_DATABASE' créée${NC}"
        else
            echo -e "${RED}❌ Impossible de créer la base de données${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Configuration annulée${NC}"
        exit 1
    fi
fi

# Créer la configuration .env
echo -e "\n${BLUE}📝 Mise à jour de la configuration .env...${NC}"

ENV_FILE="hr-backend/.env"
ENV_BACKUP="hr-backend/.env.backup.$(date +%Y%m%d_%H%M%S)"

# Sauvegarder l'ancienne configuration
if [ -f "$ENV_FILE" ]; then
    cp "$ENV_FILE" "$ENV_BACKUP"
    echo -e "${GREEN}✅ Configuration sauvegardée: $ENV_BACKUP${NC}"
fi

# Créer la nouvelle configuration
cat > "$ENV_FILE" << EOF
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:cEvM2oAXASDvfb1U/hCllrFJ1f1H3oCF5JH/GMaaZn0=
APP_DEBUG=true
APP_URL=http://localhost

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file

PHP_CLI_SERVER_WORKERS=4

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

# Configuration MySQL
DB_CONNECTION=mysql
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_DATABASE=$DB_DATABASE
DB_USERNAME=$DB_USERNAME
DB_PASSWORD=$DB_PASSWORD

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="\${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="\${APP_NAME}"
EOF

echo -e "${GREEN}✅ Configuration .env mise à jour${NC}"

# Tester la configuration Laravel
echo -e "\n${BLUE}🔍 Test de la configuration Laravel...${NC}"

cd hr-backend

# Vérifier la connexion à la base de données
if php artisan tinker --execute="DB::connection()->getPdo();" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Connexion Laravel à MySQL réussie${NC}"
else
    echo -e "${RED}❌ Erreur de connexion Laravel à MySQL${NC}"
    echo -e "${YELLOW}💡 Vérifiez la configuration dans .env${NC}"
    exit 1
fi

# Exécuter les migrations
echo -e "\n${BLUE}🔄 Exécution des migrations...${NC}"

if php artisan migrate --force; then
    echo -e "${GREEN}✅ Migrations exécutées avec succès${NC}"
else
    echo -e "${YELLOW}⚠️  Erreur lors des migrations${NC}"
    echo -e "${YELLOW}💡 Vérifiez les logs: php artisan migrate:status${NC}"
fi

cd ..

echo -e "\n${GREEN}🎉 Configuration MySQL terminée!${NC}"
echo -e "\n${BLUE}📋 Paramètres configurés:${NC}"
echo -e "   ${GREEN}Hôte: $DB_HOST${NC}"
echo -e "   ${GREEN}Port: $DB_PORT${NC}"
echo -e "   ${GREEN}Base de données: $DB_DATABASE${NC}"
echo -e "   ${GREEN}Utilisateur: $DB_USERNAME${NC}"

echo -e "\n${YELLOW}💡 Pour redémarrer l'écosystème: ./stop-all.sh && ./start-all.sh${NC}" 