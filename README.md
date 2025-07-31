# Namie-RH - Système de Gestion des Ressources Humaines

![Namie-RH Dashboard](https://img.shields.io/badge/Namie-RH-HR%20Dashboard-blue)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![Laravel](https://img.shields.io/badge/Laravel-12.x-red)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-4.0-38B2AC)

**Namie-RH** est un système complet de gestion des ressources humaines moderne, construit avec React et Laravel. Il offre une interface intuitive pour la gestion des employés, des congés, des feuilles de temps et des métriques RH.

## 🚀 Fonctionnalités

### 👥 Gestion des Employés
- Profils employés complets
- Gestion des départements
- Suivi des performances
- Mobilité interne

### 🏖️ Gestion des Congés
- Demandes de congés
- Workflow d'approbation
- Calendrier des congés
- Statistiques de présence

### ⏰ Suivi du Temps
- Pointage en temps réel
- Feuilles de temps
- Historique des heures
- Rapports de présence

### 📊 Tableaux de Bord
- Métriques RH en temps réel
- Graphiques interactifs
- Indicateurs de performance
- Rapports personnalisables

### 🔐 Authentification
- Connexion Google OAuth
- Gestion des rôles
- Sécurité renforcée
- Sessions sécurisées

## 🛠️ Architecture

### Frontend
- **React 19** avec hooks modernes
- **Tailwind CSS 4.0** pour le design
- **Chart.js** pour les graphiques
- **React Router** pour la navigation
- **Vite** pour le build

### Backend
- **Laravel 12** API REST
- **MySQL** base de données
- **Redis** cache
- **Nginx** reverse proxy
- **Docker** support

### Microservices
- Service Employés
- Service Congés
- Service Feuilles de Temps
- Service Dashboard
- Service Authentification

## 📦 Installation

### Prérequis
- Node.js 18+
- PHP 8.4+
- MySQL 8.0+
- Composer
- Git

### Installation Rapide

```bash
# Cloner le projet
git clone https://github.com/Malaldiallo93/namie-rh.git
cd namie-rh

# Installer les dépendances frontend
npm install

# Installer les dépendances backend
cd hr-backend
composer install
cd ..

# Configurer la base de données
cp hr-backend/.env.example hr-backend/.env
# Éditer hr-backend/.env avec vos paramètres DB

# Lancer les migrations
cd hr-backend
php artisan migrate
php artisan db:seed
cd ..

# Démarrer l'application
./start-all.sh
```

### URLs d'accès
- **Application principale** : http://localhost:80
- **Frontend React** : http://localhost:5173
- **Backend API** : http://localhost:8000
- **Health Check** : http://localhost:80/health

## 🔧 Configuration

### Variables d'environnement

```env
# Frontend (.env)
VITE_API_URL=http://localhost:8000/api

# Backend (hr-backend/.env)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=namie_rh
DB_USERNAME=root
DB_PASSWORD=

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Google OAuth Setup
1. Créer un projet Google Cloud
2. Configurer OAuth 2.0
3. Ajouter les URLs de redirection
4. Mettre à jour les variables d'environnement

## 📚 Documentation

- [Guide d'installation](README-SETUP.md)
- [Configuration Docker](README-DOCKER.md)
- [Guide d'authentification Google](GUIDE-AUTHENTIFICATION-GOOGLE.md)
- [Dépannage](GUIDE-DEPANNAGE-CONNEXION.md)

## 🧪 Tests

```bash
# Tests frontend
npm test

# Tests backend
cd hr-backend
php artisan test
```

## 🚀 Déploiement

### Production avec Docker
```bash
docker-compose up -d
```

### Production manuelle
```bash
# Build frontend
npm run build

# Optimiser Laravel
cd hr-backend
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Malal Diallo**
- GitHub: [@Malaldiallo93](https://github.com/Malaldiallo93)
- Email: malal.diallo@example.com

## 🙏 Remerciements

- [Cruip](https://cruip.com/) pour le template Tailwind
- [Laravel](https://laravel.com/) pour le framework backend
- [React](https://reactjs.org/) pour le framework frontend
- [Tailwind CSS](https://tailwindcss.com/) pour le CSS framework

---

⭐ Si ce projet vous aide, n'hésitez pas à lui donner une étoile !
