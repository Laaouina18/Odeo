# 🚀 ODEO - Quick Start Guide

## Installation rapide (3 minutes)

### Option 1: Script automatique (Recommandé)

**Windows:**
```powershell
# Exécuter en tant qu'administrateur
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\install.ps1
```

**Linux/Mac:**
```bash
chmod +x install.sh
./install.sh
```

### Option 2: Installation manuelle

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer le backend
npm run install:backend
npm run setup:backend

# 3. Configurer le frontend  
npm run install:frontend
npm run setup:frontend

# 4. Base de données (configurez d'abord backend/.env)
npm run migrate:fresh

# 5. Démarrer l'application
npm start
```

## 🔑 Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@odeo.com | password123 |
| Agence | agence1@odeo.com | password123 |
| Client | client1@odeo.com | password123 |

## 🌐 URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/api/documentation

## 🛠️ Commandes utiles

```bash
# Démarrer les serveurs
npm start                    # Frontend + Backend
npm run dev:frontend         # Frontend seulement
npm run dev:backend          # Backend seulement

# Base de données
npm run migrate             # Migrations seulement
npm run seed                # Seeds seulement
npm run migrate:fresh       # Reset + migrate + seed

# Maintenance
npm run clear:cache         # Nettoyer le cache Laravel
npm run logs                # Voir les logs en temps réel
```

## 🐛 Problèmes courants

### Port déjà utilisé
```bash
# Changer le port frontend
cd frontend && npm run dev -- --port 3000

# Changer le port backend  
cd backend && php artisan serve --port=8001
```

### Erreur base de données
```bash
# Vérifier la connexion MySQL
mysql -u root -p

# Recréer la base
npm run migrate:fresh
```

### Erreur JWT
```bash
cd backend && php artisan jwt:secret --force
```

## 📱 Tests

```bash
# Frontend
cd frontend && npm run test

# Backend
cd backend && php artisan test
```

---
**Happy coding! 🚀**
