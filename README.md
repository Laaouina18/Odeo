# 🏛️ ODEO - Plateforme de Services

Une plateforme moderne de gestion de services avec un système de réservation intégré, construite avec React.js et Laravel.

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Seeding de la base de données](#seeding-de-la-base-de-données)
- [Lancement de l'application](#lancement-de-lapplication)
- [Structure du projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

## 🎯 Aperçu

ODEO est une plateforme complète qui permet :
- **Aux clients** : de rechercher, réserver et gérer leurs services
- **Aux agences** : de créer, gérer leurs services et suivre les réservations
- **Aux administrateurs** : de superviser la plateforme et gérer les commissions

## 🛠️ Technologies utilisées

### Frontend
- React.js 18
- Material-UI (MUI)
- Redux Toolkit
- React Router
- Vite (build tool)

### Backend
- Laravel 10
- MySQL
- JWT Authentication
- Laravel Sanctum

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 16 ou supérieure)
- **npm** ou **yarn**
- **PHP** (version 8.1 ou supérieure)
- **Composer**
- **MySQL** (version 8.0 ou supérieure)
- **Git**

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/Laaouina18/Odeo.git
cd Odeo
```

### 2. Installation du Backend (Laravel)

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances PHP
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate
```

### 3. Installation du Frontend (React)

```bash
# Aller dans le dossier frontend
cd ../frontend

# Installer les dépendances Node.js
npm install
```

## ⚙️ Configuration

### 1. Configuration de la base de données

Editez le fichier `backend/.env` :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=odeo_db
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 2. Créer la base de données

```sql
CREATE DATABASE odeo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configuration JWT (Backend)

```bash
cd backend

# Publier la configuration JWT
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"

# Générer la clé JWT
php artisan jwt:secret
```

### 4. Configuration de l'API (Frontend)

Créez un fichier `frontend/.env` :

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_URL=http://localhost:5173
```

## 🌱 Seeding de la base de données

### 1. Exécuter les migrations

```bash
cd backend

# Exécuter les migrations
php artisan migrate
```

### 2. Exécuter les seeders

```bash
# Exécuter tous les seeders
php artisan db:seed

# Ou exécuter des seeders spécifiques
php artisan db:seed --class=AdminUserSeeder
php artisan db:seed --class=CategoriesSeeder
php artisan db:seed --class=AgenciesSeeder
php artisan db:seed --class=ServicesSeeder
php artisan db:seed --class=ClientsSeeder
```

### 3. Données de test disponibles après seeding

#### Comptes administrateur :
- **Email**: admin@odeo.com
- **Mot de passe**: password123

#### Comptes agence :
- **Email**: agence1@odeo.com
- **Mot de passe**: password123

#### Comptes client :
- **Email**: client1@odeo.com
- **Mot de passe**: password123

## 🚀 Lancement de l'application

### 1. Démarrer le serveur Backend

```bash
cd backend

# Démarrer le serveur Laravel
php artisan serve
```

Le backend sera accessible sur : `http://localhost:8000`

### 2. Démarrer le serveur Frontend

```bash
cd frontend

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera accessible sur : `http://localhost:5173`

## 📁 Structure du projet

```
Odeo/
├── backend/                 # Application Laravel
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── ...
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   └── ...
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   ├── features/      # Redux slices
│   │   ├── api/           # Configuration API
│   │   └── ...
│   ├── public/
│   └── ...
└── README.md
```

## 🎨 Fonctionnalités

### 👥 Pour les Clients
- ✅ Recherche avancée de services
- ✅ Réservation en ligne
- ✅ Suivi des réservations
- ✅ Profil utilisateur
- ✅ Historique des services

### 🏢 Pour les Agences
- ✅ Gestion des services
- ✅ Tableau de bord analytics
- ✅ Gestion des réservations
- ✅ Suivi des revenus
- ✅ Gestion du profil agence

### 👑 Pour les Administrateurs
- ✅ Dashboard complet
- ✅ Gestion des utilisateurs
- ✅ Gestion des agences
- ✅ Système de commissions
- ✅ Analytics globales
- ✅ Modération du contenu

## 🔗 API Endpoints

### Authentification
```
POST /api/register          # Inscription
POST /api/login             # Connexion
POST /api/logout            # Déconnexion
GET  /api/user              # Profil utilisateur
```

### Services
```
GET    /api/services        # Liste des services
POST   /api/services        # Créer un service
GET    /api/services/{id}   # Détail d'un service
PUT    /api/services/{id}   # Modifier un service
DELETE /api/services/{id}   # Supprimer un service
GET    /api/services/search # Recherche de services
```

### Réservations
```
GET  /api/bookings          # Liste des réservations
POST /api/bookings          # Créer une réservation
GET  /api/bookings/{id}     # Détail d'une réservation
PUT  /api/bookings/{id}     # Modifier une réservation
```

### Categories
```
GET  /api/categories        # Liste des catégories
POST /api/categories        # Créer une catégorie
```

## 🔧 Commandes utiles

### Backend (Laravel)

```bash
# Nettoyer le cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Recharger les migrations et seeders
php artisan migrate:fresh --seed

# Créer un nouveau contrôleur
php artisan make:controller NomController

# Créer un nouveau modèle
php artisan make:model NomModel -m

# Créer un nouveau seeder
php artisan make:seeder NomSeeder
```

### Frontend (React)

```bash
# Build pour production
npm run build

# Prévisualiser le build
npm run preview

# Linter le code
npm run lint

# Analyser les dépendances
npm run analyze
```

## 🐛 Troubleshooting

### Problèmes courants

#### 1. Erreur de connexion à la base de données
```bash
# Vérifier la configuration .env
# Vérifier que MySQL est démarré
# Vérifier les permissions utilisateur
```

#### 2. Erreur CORS
```bash
# Ajouter dans backend/config/cors.php
'allowed_origins' => ['http://localhost:5173'],
```

#### 3. Erreur JWT Token
```bash
# Régénérer la clé JWT
php artisan jwt:secret --force
```

#### 4. Erreur npm/node_modules
```bash
# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json
npm install
```

### Logs utiles

```bash
# Logs Laravel
tail -f backend/storage/logs/laravel.log

# Logs de développement React
# Visible dans la console du navigateur
```

## 📱 Design Responsive

L'application est entièrement responsive avec :
- **Mobile** : ≤ 768px
- **Tablet** : 769px - 1024px  
- **Desktop** : ≥ 1025px

## 🎨 Thème et couleurs

Couleur principale : `rgb(129, 39, 85)`
- Interface moderne avec Material-UI
- Design glassmorphism
- Animations fluides
- Dark/Light mode support

## 🔒 Sécurité

- JWT Authentication
- Protection CSRF
- Validation des données
- Sanitisation des entrées
- Rate limiting sur l'API

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche feature
3. Commiter vos changements
4. Pusher sur la branche
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Contact : support@odeo.com

---

**Développé avec ❤️ pour la communauté**
