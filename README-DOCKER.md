# 🐳 HR Dashboard - Guide Docker

Ce guide explique comment déployer l'application HR Dashboard avec Docker.

## 📋 Prérequis

- **Docker Desktop** installé et démarré
- **Docker Compose** (inclus avec Docker Desktop)
- Au moins **4GB de RAM** disponible

## 🚀 Démarrage rapide

### 1. Démarrer l'écosystème complet

```bash
# Script automatique (recommandé)
./docker-start.sh

# Ou manuellement
docker-compose up -d
```

### 2. Vérifier le statut

```bash
# Voir les conteneurs
docker-compose ps

# Voir les logs
docker-compose logs -f
```

### 3. Accéder à l'application

- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:8000
- **API Gateway**: http://localhost:8080

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Backend       │
│   React + Nginx │    │   Nginx         │    │   Laravel       │
│   Port 80       │    │   Port 8080     │    │   Port 8000     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   MySQL         │
                    │   Port 3306     │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Redis         │
                    │   Port 6379     │
                    └─────────────────┘
```

## 📦 Services

| Service | Port | Description |
|---------|------|-------------|
| **frontend** | 80 | Application React avec Nginx |
| **backend** | 8000 | API Laravel avec PHP-FPM + Nginx |
| **api-gateway** | 8080 | Gateway Nginx pour routing |
| **mysql** | 3306 | Base de données MySQL |
| **redis** | 6379 | Cache Redis |

## 🔧 Commandes utiles

### Gestion des conteneurs

```bash
# Démarrer tous les services
docker-compose up -d

# Arrêter tous les services
docker-compose down

# Redémarrer un service spécifique
docker-compose restart backend

# Voir les logs d'un service
docker-compose logs -f backend

# Reconstruire les images
docker-compose up --build
```

### Accès aux conteneurs

```bash
# Shell dans le backend Laravel
docker exec -it hr-backend sh

# Shell dans MySQL
docker exec -it hr-mysql mysql -u hr_user -p hr_dashboard

# Shell dans Redis
docker exec -it hr-redis redis-cli
```

### Base de données

```bash
# Exécuter les migrations
docker exec hr-backend php artisan migrate

# Exécuter les seeders
docker exec hr-backend php artisan db:seed

# Réinitialiser la base de données
docker exec hr-backend php artisan migrate:fresh --seed
```

## 🧪 Tests

### Test d'intégration

```bash
# Tester l'intégration frontend/backend
./test-integration.sh
```

### Test de configuration Docker

```bash
# Vérifier la configuration Docker
./test-docker-config.sh
```

### Tests API manuels

```bash
# Health check
curl http://localhost:8000/api/health

# Liste des employés
curl http://localhost:8000/api/employees

# Métriques dashboard
curl http://localhost:8000/api/dashboard/metrics

# Service discovery
curl http://localhost:8080/services
```

## 🔍 Dépannage

### Problèmes courants

1. **Ports déjà utilisés**
   ```bash
   # Vérifier les ports utilisés
   lsof -i :80
   lsof -i :8000
   lsof -i :8080
   ```

2. **Conteneurs qui ne démarrent pas**
   ```bash
   # Voir les logs détaillés
   docker-compose logs backend
   docker-compose logs mysql
   ```

3. **Problèmes de base de données**
   ```bash
   # Vérifier la connexion MySQL
   docker exec hr-mysql mysqladmin ping -h localhost
   
   # Vérifier les logs Laravel
   docker exec hr-backend tail -f storage/logs/laravel.log
   ```

### Nettoyage complet

```bash
# Arrêter et supprimer tous les conteneurs
docker-compose down -v

# Supprimer les images
docker-compose down --rmi all

# Supprimer les volumes
docker volume prune

# Nettoyer complètement
docker system prune -a
```

## 📊 Monitoring

### Statut des services

```bash
# Voir le statut de tous les services
docker-compose ps

# Voir l'utilisation des ressources
docker stats
```

### Logs en temps réel

```bash
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

## 🔐 Variables d'environnement

Les variables d'environnement sont configurées dans `docker-compose.yml` :

- `DB_HOST=mysql`
- `DB_DATABASE=hr_dashboard`
- `DB_USERNAME=hr_user`
- `DB_PASSWORD=hr_password`
- `REDIS_HOST=redis`
- `APP_ENV=production`

## 📝 Notes importantes

1. **Base de données** : Les données MySQL sont persistées dans un volume Docker
2. **Cache** : Redis est utilisé pour le cache Laravel
3. **Logs** : Les logs sont accessibles via `docker-compose logs`
4. **Performance** : L'application est optimisée pour la production

## 🚀 Déploiement en production

Pour un déploiement en production :

1. Modifier les variables d'environnement
2. Configurer un reverse proxy (Nginx/Apache)
3. Configurer SSL/TLS
4. Mettre en place un monitoring
5. Configurer les sauvegardes de base de données

---

**✨ L'application HR Dashboard est maintenant entièrement containerisée et prête pour le déploiement !** 