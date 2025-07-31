# 🔄 Migration de SQLite vers MySQL

## Vue d'ensemble

Ce guide vous aide à migrer votre application HR Dashboard de SQLite vers MySQL.

## 📋 Prérequis

- MySQL installé et configuré
- Base de données `data_hr` créée
- Accès administrateur à MySQL

## 🚀 Migration Automatique

### Option 1 : Script automatique (recommandé)

```bash
# Exécuter le script de configuration MySQL
./configure-mysql.sh
```

Ce script va :
1. Tester la connexion MySQL
2. Vérifier l'existence de la base de données `data_hr`
3. Mettre à jour le fichier `.env`
4. Exécuter les migrations Laravel
5. Tester la connexion

### Option 2 : Migration manuelle

#### 1. Sauvegarder les données SQLite (optionnel)

```bash
# Copier la base SQLite
cp hr-backend/database/database.sqlite hr-backend/database/database.sqlite.backup

# Exporter les données (si nécessaire)
cd hr-backend
php artisan tinker --execute="
    \$tables = DB::select('SELECT name FROM sqlite_master WHERE type=\"table\"');
    foreach(\$tables as \$table) {
        \$data = DB::table(\$table->name)->get();
        file_put_contents('database/backup_' . \$table->name . '.json', json_encode(\$data));
    }
"
```

#### 2. Configurer MySQL

Modifiez le fichier `hr-backend/.env` :

```env
# Remplacer cette section :
DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=

# Par celle-ci :
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=data_hr
DB_USERNAME=root
DB_PASSWORD=
```

#### 3. Créer la base de données MySQL

```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE data_hr;
USE data_hr;
EXIT;
```

#### 4. Exécuter les migrations

```bash
cd hr-backend

# Vider le cache de configuration
php artisan config:clear

# Exécuter les migrations
php artisan migrate

# Vérifier le statut
php artisan migrate:status
```

#### 5. Tester la connexion

```bash
# Tester la connexion Laravel
php artisan tinker --execute="DB::connection()->getPdo();"

# Vérifier les tables
php artisan tinker --execute="
    \$tables = DB::select('SHOW TABLES');
    foreach(\$tables as \$table) {
        echo array_values((array)\$table)[0] . PHP_EOL;
    }
"
```

## 🔍 Vérification

### Script de vérification

```bash
# Vérifier la configuration MySQL
./check-database.sh
```

### Tests manuels

```bash
# Tester la connexion MySQL
mysql -u root -p -e "USE data_hr; SHOW TABLES;"

# Tester Laravel
cd hr-backend
php artisan tinker --execute="echo 'Connexion OK: ' . DB::connection()->getDatabaseName();"
```

## 🐛 Dépannage

### Problèmes courants

#### 1. Erreur de connexion MySQL

```bash
# Vérifier que MySQL est démarré
brew services list | grep mysql

# Démarrer MySQL si nécessaire
brew services start mysql

# Vérifier les paramètres de connexion
mysql -u root -p -e "SELECT 1;"
```

#### 2. Base de données inexistante

```bash
# Créer la base de données
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS data_hr;"
```

#### 3. Erreur de permissions

```bash
# Vérifier les permissions MySQL
mysql -u root -p -e "SHOW GRANTS FOR 'root'@'localhost';"

# Accorder les permissions si nécessaire
mysql -u root -p -e "GRANT ALL PRIVILEGES ON data_hr.* TO 'root'@'localhost';"
```

#### 4. Erreur de migration

```bash
# Vider le cache
cd hr-backend
php artisan config:clear
php artisan cache:clear

# Réinitialiser les migrations
php artisan migrate:reset
php artisan migrate
```

## 📊 Comparaison SQLite vs MySQL

| Aspect | SQLite | MySQL |
|--------|--------|-------|
| **Type** | Fichier | Serveur |
| **Concurrence** | Limitée | Élevée |
| **Performance** | Bonne pour petit volume | Excellente |
| **Configuration** | Simple | Plus complexe |
| **Production** | Déconseillé | Recommandé |
| **Sauvegarde** | Copie de fichier | Outils dédiés |

## 🔄 Rollback (retour à SQLite)

Si vous devez revenir à SQLite :

```bash
# Modifier .env
DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=

# Vider le cache
cd hr-backend
php artisan config:clear

# Restaurer la base SQLite (si sauvegardée)
cp database/database.sqlite.backup database/database.sqlite
```

## 📈 Avantages de MySQL

1. **Performance** : Meilleure pour les applications avec beaucoup d'utilisateurs
2. **Concurrence** : Gestion avancée des accès simultanés
3. **Fonctionnalités** : Triggers, procédures stockées, vues
4. **Sauvegarde** : Outils de sauvegarde et restauration robustes
5. **Monitoring** : Outils de monitoring et optimisation
6. **Production** : Standard de l'industrie pour les applications web

## 🎯 Prochaines étapes

Après la migration vers MySQL :

1. **Optimiser** : Configurer les index et requêtes
2. **Sauvegarder** : Mettre en place des sauvegardes automatiques
3. **Monitorer** : Configurer le monitoring de la base de données
4. **Sécuriser** : Configurer les utilisateurs et permissions

---

**✅ Migration terminée ! Votre application utilise maintenant MySQL.** 