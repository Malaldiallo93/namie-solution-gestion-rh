# HR Dashboard - Guide de Configuration et Utilisation

## 🚀 Vue d'ensemble

Cette application HR Dashboard est composée de plusieurs microservices :
- **Frontend React** (port 5173) - Interface utilisateur moderne
- **Backend Laravel** (port 8000) - API et logique métier
- **Nginx Reverse Proxy** (port 80) - Point d'entrée unifié et load balancer

## 📋 Prérequis

### Outils nécessaires
- **Node.js** (v18+) - Pour le frontend React
- **PHP** (v8.2+) - Pour le backend Laravel
- **Composer** - Gestionnaire de dépendances PHP
- **MySQL** (v8.0+) - Base de données
- **Nginx** - Serveur web et reverse proxy

### Installation des prérequis

```bash
# Installer Node.js (via Homebrew)
brew install node

# Installer PHP (via Homebrew)
brew install php

# Installer Composer
brew install composer

# Installer MySQL
brew install mysql

# Installer Nginx
brew install nginx
```

## 🛠️ Configuration

### 1. Configuration de l'environnement

L'application utilise les configurations par défaut :
- Frontend React : `http://localhost:5173`
- Backend Laravel : `http://localhost:8000`
- Nginx Reverse Proxy : `http://localhost:80`
- Base de données MySQL : `data_hr`

### 2. Configuration Nginx

Le fichier `nginx-hr-dashboard.conf` contient la configuration du reverse proxy :
- Redirection des requêtes API vers le backend Laravel
- Servir le frontend React pour toutes les autres requêtes
- Gestion des WebSockets pour le Hot Module Replacement (HMR)
- Headers de sécurité et compression gzip

## 🚀 Démarrage rapide

### Option 1 : Configuration et démarrage automatique (recommandé)

```bash
# Configurer MySQL (première fois seulement)
./configure-mysql.sh

# Démarrer tout l'écosystème
./start-all.sh

# Arrêter tout l'écosystème
./stop-all.sh
```

### Option 2 : Démarrage manuel

```bash
# 1. Démarrer le Frontend React
npm run dev

# 2. Démarrer le Backend Laravel (dans un autre terminal)
cd hr-backend
php artisan serve --host=127.0.0.1 --port=8000

# 3. Démarrer Nginx (dans un autre terminal)
sudo nginx
```

## 📊 URLs d'accès

Une fois démarré, l'application est accessible via :

- **Application principale** : http://localhost:80
- **Frontend React** : http://localhost:5173
- **Backend Laravel** : http://localhost:8000
- **Health check** : http://localhost:80/health

## 🔧 Commandes utiles

### Gestion des services

```bash
# Démarrer tout l'écosystème
./start-all.sh

# Arrêter tout l'écosystème
./stop-all.sh

# Démarrer seulement les microservices
./start-services.sh

# Arrêter seulement les microservices
./stop-services.sh

# Démarrer seulement Nginx
./start-nginx.sh
```

### Base de données MySQL

```bash
# Configurer MySQL
./configure-mysql.sh

# Vérifier la base de données
./check-database.sh
```

### Nginx

```bash
# Tester la configuration
sudo nginx -t

# Recharger la configuration
sudo nginx -s reload

# Arrêter Nginx
sudo nginx -s quit

# Voir les logs d'erreur
sudo tail -f /opt/homebrew/var/log/nginx/hr-dashboard-error.log

# Voir les logs d'accès
sudo tail -f /opt/homebrew/var/log/nginx/hr-dashboard-access.log
```

### Laravel (Backend)

```bash
# Accéder au répertoire backend
cd hr-backend

# Voir les routes disponibles
php artisan route:list

# Vider le cache
php artisan cache:clear

# Exécuter les migrations
php artisan migrate

# Démarrer en mode développement
php artisan serve --host=127.0.0.1 --port=8000
```

### React (Frontend)

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la build
npm run preview
```

## 🐛 Dépannage

### Problèmes courants

#### 1. Port déjà utilisé

```bash
# Vérifier les ports utilisés
lsof -i :5173 -i :8000 -i :80

# Tuer les processus sur un port spécifique
lsof -ti:5173 | xargs kill -9
```

#### 2. Nginx ne démarre pas

```bash
# Vérifier la configuration
sudo nginx -t

# Vérifier les logs
sudo tail -f /opt/homebrew/var/log/nginx/hr-dashboard-error.log
```

#### 3. Backend Laravel inaccessible

```bash
# Vérifier la base de données MySQL
./check-database.sh

# Vérifier que la base de données est configurée
cd hr-backend
php artisan migrate:status

# Vérifier les logs Laravel
tail -f storage/logs/laravel.log
```

#### 4. Frontend React ne charge pas

```bash
# Vérifier les dépendances
npm install

# Vérifier la configuration Vite
cat vite.config.js
```

### Logs et monitoring

```bash
# Logs Nginx
sudo tail -f /opt/homebrew/var/log/nginx/hr-dashboard-error.log
sudo tail -f /opt/homebrew/var/log/nginx/hr-dashboard-access.log

# Logs Laravel
tail -f hr-backend/storage/logs/laravel.log

# Logs React (dans le terminal où npm run dev est lancé)
```

## 🔒 Sécurité

### Headers de sécurité configurés

- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer-when-downgrade`
- `Content-Security-Policy: default-src 'self' http: https: data: blob: 'unsafe-inline'`

### CORS

Les requêtes CORS sont configurées pour permettre l'accès depuis le frontend vers le backend.

## 📁 Structure des fichiers

```
tailwind-dashboard-template-RH/
├── start-all.sh              # Script principal de démarrage
├── stop-all.sh               # Script principal d'arrêt
├── start-services.sh         # Démarrage des microservices
├── stop-services.sh          # Arrêt des microservices
├── start-nginx.sh            # Démarrage de Nginx
├── nginx-hr-dashboard.conf   # Configuration Nginx
├── src/                      # Frontend React
├── hr-backend/               # Backend Laravel
└── README-SETUP.md           # Ce fichier
```

## 🤝 Contribution

Pour contribuer au projet :

1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📞 Support

En cas de problème :

1. Vérifier les logs (voir section Dépannage)
2. Consulter la documentation Laravel et React
3. Créer une issue sur le repository

---

**Note** : Cette configuration est optimisée pour le développement local. Pour la production, des ajustements de sécurité et de performance supplémentaires sont nécessaires. 