#!/bin/bash

# 🏛️ ODEO - Script d'installation automatique
# Ce script installe et configure automatiquement l'application ODEO

echo "🏛️ === INSTALLATION ODEO === 🏛️"
echo ""

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérification des prérequis
check_requirements() {
    log_info "Vérification des prérequis..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
        exit 1
    fi
    log_success "Node.js $(node --version) détecté"
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        log_error "npm n'est pas installé."
        exit 1
    fi
    log_success "npm $(npm --version) détecté"
    
    # Vérifier PHP
    if ! command -v php &> /dev/null; then
        log_error "PHP n'est pas installé. Veuillez l'installer."
        exit 1
    fi
    log_success "PHP $(php --version | head -n 1) détecté"
    
    # Vérifier Composer
    if ! command -v composer &> /dev/null; then
        log_error "Composer n'est pas installé. Veuillez l'installer depuis https://getcomposer.org/"
        exit 1
    fi
    log_success "Composer détecté"
    
    # Vérifier MySQL
    if ! command -v mysql &> /dev/null; then
        log_warning "MySQL n'est pas détecté dans le PATH. Assurez-vous qu'il est installé et en cours d'exécution."
    else
        log_success "MySQL détecté"
    fi
}

# Installation du backend
install_backend() {
    log_info "Installation du backend Laravel..."
    
    cd backend || { log_error "Le dossier backend n'existe pas"; exit 1; }
    
    # Installation des dépendances
    log_info "Installation des dépendances PHP..."
    composer install
    
    # Configuration de l'environnement
    if [ ! -f .env ]; then
        log_info "Création du fichier .env..."
        cp .env.example .env
        log_success "Fichier .env créé"
    else
        log_warning "Le fichier .env existe déjà"
    fi
    
    # Génération de la clé d'application
    log_info "Génération de la clé d'application..."
    php artisan key:generate
    
    # Configuration JWT
    log_info "Configuration JWT..."
    php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider" --quiet
    php artisan jwt:secret --force
    
    cd ..
    log_success "Backend installé avec succès"
}

# Installation du frontend
install_frontend() {
    log_info "Installation du frontend React..."
    
    cd frontend || { log_error "Le dossier frontend n'existe pas"; exit 1; }
    
    # Installation des dépendances
    log_info "Installation des dépendances Node.js..."
    npm install
    
    # Configuration de l'environnement
    if [ ! -f .env ]; then
        log_info "Création du fichier .env frontend..."
        cat > .env << EOL
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_URL=http://localhost:5173
EOL
        log_success "Fichier .env frontend créé"
    else
        log_warning "Le fichier .env frontend existe déjà"
    fi
    
    cd ..
    log_success "Frontend installé avec succès"
}

# Configuration de la base de données
setup_database() {
    log_info "Configuration de la base de données..."
    
    cd backend
    
    # Demander les informations de base de données
    echo ""
    log_info "Configuration de la base de données MySQL:"
    read -p "Nom de la base de données (défaut: odeo_db): " db_name
    db_name=${db_name:-odeo_db}
    
    read -p "Utilisateur MySQL (défaut: root): " db_user
    db_user=${db_user:-root}
    
    read -s -p "Mot de passe MySQL: " db_password
    echo ""
    
    read -p "Host MySQL (défaut: 127.0.0.1): " db_host
    db_host=${db_host:-127.0.0.1}
    
    read -p "Port MySQL (défaut: 3306): " db_port
    db_port=${db_port:-3306}
    
    # Mise à jour du fichier .env
    log_info "Mise à jour de la configuration .env..."
    sed -i "s/DB_DATABASE=.*/DB_DATABASE=$db_name/" .env
    sed -i "s/DB_USERNAME=.*/DB_USERNAME=$db_user/" .env
    sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$db_password/" .env
    sed -i "s/DB_HOST=.*/DB_HOST=$db_host/" .env
    sed -i "s/DB_PORT=.*/DB_PORT=$db_port/" .env
    
    # Création de la base de données
    log_info "Création de la base de données..."
    mysql -h "$db_host" -P "$db_port" -u "$db_user" -p"$db_password" -e "CREATE DATABASE IF NOT EXISTS $db_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    
    if [ $? -eq 0 ]; then
        log_success "Base de données créée avec succès"
    else
        log_error "Erreur lors de la création de la base de données"
        exit 1
    fi
    
    cd ..
}

# Exécution des migrations et seeders
run_migrations_and_seeds() {
    log_info "Exécution des migrations et seeders..."
    
    cd backend
    
    # Migrations
    log_info "Exécution des migrations..."
    php artisan migrate
    
    if [ $? -eq 0 ]; then
        log_success "Migrations exécutées avec succès"
    else
        log_error "Erreur lors des migrations"
        exit 1
    fi
    
    # Seeders
    log_info "Exécution des seeders..."
    php artisan db:seed
    
    if [ $? -eq 0 ]; then
        log_success "Seeders exécutés avec succès"
    else
        log_error "Erreur lors des seeders"
        exit 1
    fi
    
    cd ..
}

# Affichage des informations de connexion
show_login_info() {
    echo ""
    log_success "🎉 Installation terminée avec succès !"
    echo ""
    log_info "=== INFORMATIONS DE CONNEXION ==="
    echo ""
    echo -e "${GREEN}👑 ADMINISTRATEUR:${NC}"
    echo "   Email: admin@odeo.com"
    echo "   Mot de passe: password123"
    echo ""
    echo -e "${BLUE}🏢 AGENCE:${NC}"
    echo "   Email: agence1@odeo.com"
    echo "   Mot de passe: password123"
    echo ""
    echo -e "${YELLOW}👤 CLIENT:${NC}"
    echo "   Email: client1@odeo.com"
    echo "   Mot de passe: password123"
    echo ""
    log_info "=== POUR DÉMARRER L'APPLICATION ==="
    echo ""
    echo "1. Démarrer le backend:"
    echo "   cd backend && php artisan serve"
    echo ""
    echo "2. Démarrer le frontend (dans un autre terminal):"
    echo "   cd frontend && npm run dev"
    echo ""
    echo "3. Accéder à l'application:"
    echo "   Frontend: http://localhost:5173"
    echo "   Backend API: http://localhost:8000"
    echo ""
}

# Menu principal
main_menu() {
    echo "Que souhaitez-vous faire ?"
    echo "1. Installation complète (recommandé)"
    echo "2. Installer seulement le backend"
    echo "3. Installer seulement le frontend"
    echo "4. Configurer seulement la base de données"
    echo "5. Exécuter seulement les migrations/seeders"
    echo "6. Quitter"
    echo ""
    read -p "Votre choix (1-6): " choice
    
    case $choice in
        1)
            check_requirements
            install_backend
            install_frontend
            setup_database
            run_migrations_and_seeds
            show_login_info
            ;;
        2)
            check_requirements
            install_backend
            log_success "Backend installé. N'oubliez pas de configurer la base de données."
            ;;
        3)
            check_requirements
            install_frontend
            log_success "Frontend installé."
            ;;
        4)
            setup_database
            ;;
        5)
            run_migrations_and_seeds
            show_login_info
            ;;
        6)
            log_info "Au revoir !"
            exit 0
            ;;
        *)
            log_error "Choix invalide"
            main_menu
            ;;
    esac
}

# Point d'entrée principal
main() {
    echo "🏛️ Bienvenue dans l'installateur ODEO"
    echo ""
    main_menu
}

# Exécution du script
main "$@"
