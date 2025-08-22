# 🏛️ ODEO - Script d'installation PowerShell pour Windows
# Ce script installe et configure automatiquement l'application ODEO sur Windows

Write-Host "🏛️ === INSTALLATION ODEO === 🏛️" -ForegroundColor Cyan
Write-Host ""

# Fonction pour afficher les messages colorés
function Write-Info($message) {
    Write-Host "ℹ️  $message" -ForegroundColor Blue
}

function Write-Success($message) {
    Write-Host "✅ $message" -ForegroundColor Green
}

function Write-Warning($message) {
    Write-Host "⚠️  $message" -ForegroundColor Yellow
}

function Write-Error($message) {
    Write-Host "❌ $message" -ForegroundColor Red
}

# Vérification des prérequis
function Check-Requirements {
    Write-Info "Vérification des prérequis..."
    
    # Vérifier Node.js
    try {
        $nodeVersion = node --version
        Write-Success "Node.js $nodeVersion détecté"
    }
    catch {
        Write-Error "Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
        exit 1
    }
    
    # Vérifier npm
    try {
        $npmVersion = npm --version
        Write-Success "npm $npmVersion détecté"
    }
    catch {
        Write-Error "npm n'est pas installé."
        exit 1
    }
    
    # Vérifier PHP
    try {
        $phpVersion = php --version
        Write-Success "PHP détecté"
    }
    catch {
        Write-Error "PHP n'est pas installé. Veuillez l'installer."
        exit 1
    }
    
    # Vérifier Composer
    try {
        composer --version | Out-Null
        Write-Success "Composer détecté"
    }
    catch {
        Write-Error "Composer n'est pas installé. Veuillez l'installer depuis https://getcomposer.org/"
        exit 1
    }
    
    # Vérifier MySQL
    try {
        mysql --version | Out-Null
        Write-Success "MySQL détecté"
    }
    catch {
        Write-Warning "MySQL n'est pas détecté dans le PATH. Assurez-vous qu'il est installé et en cours d'exécution."
    }
}

# Installation du backend
function Install-Backend {
    Write-Info "Installation du backend Laravel..."
    
    if (-not (Test-Path "backend")) {
        Write-Error "Le dossier backend n'existe pas"
        exit 1
    }
    
    Set-Location backend
    
    # Installation des dépendances
    Write-Info "Installation des dépendances PHP..."
    composer install
    
    # Configuration de l'environnement
    if (-not (Test-Path ".env")) {
        Write-Info "Création du fichier .env..."
        Copy-Item ".env.example" ".env"
        Write-Success "Fichier .env créé"
    }
    else {
        Write-Warning "Le fichier .env existe déjà"
    }
    
    # Génération de la clé d'application
    Write-Info "Génération de la clé d'application..."
    php artisan key:generate
    
    # Configuration JWT
    Write-Info "Configuration JWT..."
    php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider" --quiet
    php artisan jwt:secret --force
    
    Set-Location ..
    Write-Success "Backend installé avec succès"
}

# Installation du frontend
function Install-Frontend {
    Write-Info "Installation du frontend React..."
    
    if (-not (Test-Path "frontend")) {
        Write-Error "Le dossier frontend n'existe pas"
        exit 1
    }
    
    Set-Location frontend
    
    # Installation des dépendances
    Write-Info "Installation des dépendances Node.js..."
    npm install
    
    # Configuration de l'environnement
    if (-not (Test-Path ".env")) {
        Write-Info "Création du fichier .env frontend..."
        @"
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_URL=http://localhost:5173
"@ | Out-File -FilePath ".env" -Encoding UTF8
        Write-Success "Fichier .env frontend créé"
    }
    else {
        Write-Warning "Le fichier .env frontend existe déjà"
    }
    
    Set-Location ..
    Write-Success "Frontend installé avec succès"
}

# Configuration de la base de données
function Setup-Database {
    Write-Info "Configuration de la base de données..."
    
    Set-Location backend
    
    # Demander les informations de base de données
    Write-Host ""
    Write-Info "Configuration de la base de données MySQL:"
    $dbName = Read-Host "Nom de la base de données (défaut: odeo_db)"
    if ([string]::IsNullOrEmpty($dbName)) { $dbName = "odeo_db" }
    
    $dbUser = Read-Host "Utilisateur MySQL (défaut: root)"
    if ([string]::IsNullOrEmpty($dbUser)) { $dbUser = "root" }
    
    $dbPassword = Read-Host "Mot de passe MySQL" -AsSecureString
    $dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))
    
    $dbHost = Read-Host "Host MySQL (défaut: 127.0.0.1)"
    if ([string]::IsNullOrEmpty($dbHost)) { $dbHost = "127.0.0.1" }
    
    $dbPort = Read-Host "Port MySQL (défaut: 3306)"
    if ([string]::IsNullOrEmpty($dbPort)) { $dbPort = "3306" }
    
    # Mise à jour du fichier .env
    Write-Info "Mise à jour de la configuration .env..."
    $envContent = Get-Content ".env"
    $envContent = $envContent -replace "DB_DATABASE=.*", "DB_DATABASE=$dbName"
    $envContent = $envContent -replace "DB_USERNAME=.*", "DB_USERNAME=$dbUser"
    $envContent = $envContent -replace "DB_PASSWORD=.*", "DB_PASSWORD=$dbPasswordPlain"
    $envContent = $envContent -replace "DB_HOST=.*", "DB_HOST=$dbHost"
    $envContent = $envContent -replace "DB_PORT=.*", "DB_PORT=$dbPort"
    $envContent | Set-Content ".env"
    
    # Création de la base de données
    Write-Info "Création de la base de données..."
    try {
        mysql -h $dbHost -P $dbPort -u $dbUser -p$dbPasswordPlain -e "CREATE DATABASE IF NOT EXISTS $dbName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        Write-Success "Base de données créée avec succès"
    }
    catch {
        Write-Error "Erreur lors de la création de la base de données"
        exit 1
    }
    
    Set-Location ..
}

# Exécution des migrations et seeders
function Run-MigrationsAndSeeds {
    Write-Info "Exécution des migrations et seeders..."
    
    Set-Location backend
    
    # Migrations
    Write-Info "Exécution des migrations..."
    php artisan migrate
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Migrations exécutées avec succès"
    }
    else {
        Write-Error "Erreur lors des migrations"
        exit 1
    }
    
    # Seeders
    Write-Info "Exécution des seeders..."
    php artisan db:seed
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Seeders exécutés avec succès"
    }
    else {
        Write-Error "Erreur lors des seeders"
        exit 1
    }
    
    Set-Location ..
}

# Affichage des informations de connexion
function Show-LoginInfo {
    Write-Host ""
    Write-Success "🎉 Installation terminée avec succès !"
    Write-Host ""
    Write-Info "=== INFORMATIONS DE CONNEXION ==="
    Write-Host ""
    Write-Host "👑 ADMINISTRATEUR:" -ForegroundColor Green
    Write-Host "   Email: admin@odeo.com"
    Write-Host "   Mot de passe: password123"
    Write-Host ""
    Write-Host "🏢 AGENCE:" -ForegroundColor Blue
    Write-Host "   Email: agence1@odeo.com"
    Write-Host "   Mot de passe: password123"
    Write-Host ""
    Write-Host "👤 CLIENT:" -ForegroundColor Yellow
    Write-Host "   Email: client1@odeo.com"
    Write-Host "   Mot de passe: password123"
    Write-Host ""
    Write-Info "=== POUR DÉMARRER L'APPLICATION ==="
    Write-Host ""
    Write-Host "1. Démarrer le backend:"
    Write-Host "   cd backend; php artisan serve"
    Write-Host ""
    Write-Host "2. Démarrer le frontend (dans un autre terminal):"
    Write-Host "   cd frontend; npm run dev"
    Write-Host ""
    Write-Host "3. Accéder à l'application:"
    Write-Host "   Frontend: http://localhost:5173"
    Write-Host "   Backend API: http://localhost:8000"
    Write-Host ""
}

# Menu principal
function Show-MainMenu {
    Write-Host "Que souhaitez-vous faire ?"
    Write-Host "1. Installation complète (recommandé)"
    Write-Host "2. Installer seulement le backend"
    Write-Host "3. Installer seulement le frontend"
    Write-Host "4. Configurer seulement la base de données"
    Write-Host "5. Exécuter seulement les migrations/seeders"
    Write-Host "6. Quitter"
    Write-Host ""
    $choice = Read-Host "Votre choix (1-6)"
    
    switch ($choice) {
        "1" {
            Check-Requirements
            Install-Backend
            Install-Frontend
            Setup-Database
            Run-MigrationsAndSeeds
            Show-LoginInfo
        }
        "2" {
            Check-Requirements
            Install-Backend
            Write-Success "Backend installé. N'oubliez pas de configurer la base de données."
        }
        "3" {
            Check-Requirements
            Install-Frontend
            Write-Success "Frontend installé."
        }
        "4" {
            Setup-Database
        }
        "5" {
            Run-MigrationsAndSeeds
            Show-LoginInfo
        }
        "6" {
            Write-Info "Au revoir !"
            exit 0
        }
        default {
            Write-Error "Choix invalide"
            Show-MainMenu
        }
    }
}

# Point d'entrée principal
function Main {
    Write-Host "🏛️ Bienvenue dans l'installateur ODEO" -ForegroundColor Cyan
    Write-Host ""
    Show-MainMenu
}

# Exécution du script
Main
