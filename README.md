# 🚀 Gestion Projets - Plateforme Multi-tenant

Plateforme de gestion de projets collaborative avec architecture micro-services, construite avec Node.js, React, TypeScript, PostgreSQL et Docker.

## 📖 Table des Matières

- [Architecture du Projet](#-architecture-du-projet)
- [Technologies Utilisées](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation et Démarrage Rapide](#-installation-et-démarrage-rapide)
- [Services](#-services)
- [Utilisateurs de Démonstration](#-utilisateurs-de-démonstration)
- [API Endpoints](#-api-endpoints)
- [Structure Frontend](#-structure-frontend)
- [Déploiement](#-déploiement)
- [Dépannage](#-dépannage)
- [Contributions](#-contributions)

## 🏗 Architecture du Projet

Ce projet suit une architecture micro-services avec isolation multi-tenant :

### Services Backend

- **🔐 Auth Service** (`:9000`) - Authentification, utilisateurs, rôles et permissions
- **📊 Project Service** (`:9001`) - Gestion des projets, tâches et organisations

### Frontend

- **🎨 React App** (`:4001`) - Interface utilisateur moderne avec Tailwind CSS

### Structure Globale

```
GESTIONSPROJET/
├── 📁 backend/
│   ├── 📁 auth-service/           # Service d'authentification (Port 9000)
│   └── 📁 manage_projets_service/ # Service de gestion (Port 9001)
├── 📁 frontend/
│   └── 📁 frontend-gestion-projets/ # Application React (Port 4001)
└── ⚙️ docker-compose.yml
```

## 🛠 Technologies Utilisées

### Backend
- **Node.js** + **TypeScript** + **Express.js**
- **PostgreSQL** avec **Sequelize ORM**
- **JWT** pour l'authentification
- **Docker** & **Docker Compose**
- **Swagger/OpenAPI** pour la documentation

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS** pour le styling
- **React Router v6** pour la navigation
- **Axios** pour les appels API
- **Context API** pour la gestion d'état

## 📋 Prérequis

- **Docker** et **Docker Compose**
- **Node.js 18+** (pour le développement)
- **Git**

## 🚀 Installation et Démarrage Rapide

### 1. Clonage et Démarrage

```bash
# Cloner le projet
git clone <repository-url>
cd GESTIONSPROJET

# Démarrer tous les services
docker-compose up --build -d
```

### 2. Initialisation de la Base de Données

```bash
# Exécuter les seeders dans l'ordre (CRUCIAL)
docker exec -it gestionsprojet-auth-service-1 npx sequelize-cli db:seed --seed 20251017154139-roles.js
docker exec -it gestionsprojet-auth-service-1 npx sequelize-cli db:seed --seed 20251017154210-permissions.js
docker exec -it gestionsprojet-auth-service-1 npx sequelize-cli db:seed --seed 20251017160642-utilisateurs.js
```

### 3. Accès aux Applications

- **🌐 Frontend** : http://localhost:4001
- **🔐 Auth Service API** : http://localhost:9000/api/v1
- **📊 Project Service API** : http://localhost:9001/api/v1
- **📚 Documentation Auth API** : http://localhost:9000/api-docs

## 🔧 Services

### Auth Service (:9000)
Gère l'authentification, les utilisateurs, rôles et permissions.

**Fonctionnalités :**
- ✅ Authentification JWT avec refresh tokens
- ✅ Gestion des utilisateurs multi-rôles
- ✅ Système de permissions granulaires
- ✅ Vérification OTP par email/téléphone
- ✅ Gestion des profils utilisateurs

### Project Service (:9001)
Gère les organisations, projets et tâches avec isolation multi-tenant.

**Fonctionnalités :**
- ✅ Organisations multi-tenants
- ✅ Gestion complète des projets
- ✅ Système de tâches avec assignation
- ✅ Membres et permissions par organisation
- ✅ Isolation des données par tenant

### Frontend (:4001)
Interface utilisateur moderne et responsive.

**Fonctionnalités :**
- ✅ Dashboard avec statistiques
- ✅ Gestion visuelle des projets et tâches
- ✅ Interface multi-organisations
- ✅ Design system avec Tailwind CSS
- ✅ Routing protégé par rôles

## 👥 Utilisateurs de Démonstration

| Email | Rôle | Mot de passe | Accès |
|-------|------|--------------|-------|
| `superadmin@projectapp.com` | Super Admin | `password123` | Accès complet |
| `owner@company.com` | Organization Owner | `password123` | Gestion d'organisation |
| `manager@company.com` | Project Manager | `password123` | Gestion de projets |
| `admin@company.com` | Organization Admin | `password123` | Administration organisation |
| `lead@company.com` | Team Lead | `password123` | Gestion d'équipe |
| `member1@company.com` | Member | `password123` | Accès standard |
| `viewer@company.com` | Viewer | `password123` | Lecture seule |

## 🔌 API Endpoints Principaux

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/auth/login` | Connexion (email/téléphone) |
| `POST` | `/auth/register` | Inscription avec OTP |
| `POST` | `/auth/refresh-token` | Rafraîchissement du token |
| `POST` | `/auth/logout` | Déconnexion |
| `GET` | `/auth/profile` | Profil utilisateur |

### Gestion des Utilisateurs

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/users` | Liste des utilisateurs |
| `POST` | `/users` | Créer un utilisateur |
| `GET` | `/users/:id` | Détails utilisateur |
| `PUT` | `/users/:id` | Modifier un utilisateur |

### Organisations (Multi-tenant)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/organizations` | Mes organisations |
| `POST` | `/organizations` | Créer une organisation |
| `GET` | `/organizations/:id` | Détails organisation |
| `POST` | `/members/invite` | Inviter un membre |

### Projets et Tâches

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/projects` | Liste des projets |
| `POST` | `/projects` | Créer un projet |
| `GET` | `/projects/:id` | Détails projet |
| `GET` | `/tasks` | Liste des tâches |
| `POST` | `/tasks` | Créer une tâche |

## 🎨 Structure Frontend

### Architecture React

```
frontend-gestion-projets/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 common/          # Composants réutilisables
│   │   ├── 📁 ui/              # Composants d'interface
│   │   └── 📁 forms/           # Formulaires
│   ├── 📁 pages/               # Pages de l'application
│   │   ├── 📁 auth/            # Authentification
│   │   ├── 📁 dashboard/       # Tableau de bord
│   │   ├── 📁 projects/        # Gestion projets
│   │   ├── 📁 tasks/           # Gestion tâches
│   │   ├── 📁 organizations/   # Organisations
│   │   └── 📁 users/           # Utilisateurs
│   ├── 📁 contexts/            # Contexts React
│   ├── 📁 hooks/               # Custom hooks
│   ├── 📁 services/            # Services API
│   ├── 📁 types/               # Types TypeScript
│   └── 📁 utils/               # Utilitaires
```

### Pages Principales

- **`/login`** - Connexion avec identifiants de démo
- **`/dashboard`** - Vue d'ensemble avec statistiques
- **`/projects`** - Liste et gestion des projets
- **`/tasks`** - Liste et gestion des tâches
- **`/organizations`** - Gestion des organisations
- **`/users`** - Gestion des utilisateurs

## 🐳 Déploiement

### Variables d'Environnement

**Frontend (.env)**
```env
REACT_APP_API_AUTH_URL=http://localhost:9000/api/v1
REACT_APP_API_PROJECT_URL=http://localhost:9001/api/v1
```

**Auth Service (.env)**
```env
DB_NAME=auth_service
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=postgres
DB_PORT=5432
JWT_PRIVATE_KEY=your_jwt_private_key
```

### Commandes Docker Utiles

```bash
# Démarrer les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Reconstruire les images
docker-compose build --no-cache

# Accéder à un conteneur
docker exec -it gestionsprojet-auth-service-1 sh
```

## 🐛 Dépannage

### Problèmes Courants

#### 1. Erreurs de ports
```bash
# Vérifier les ports utilisés
netstat -tulpn | grep :4001
```

#### 2. Base de données non accessible
```bash
# Vérifier que PostgreSQL tourne
docker-compose ps

# Réinitialiser la base
docker-compose down -v
docker-compose up -d
```

#### 3. Seeders échouent
```bash
# Réinitialiser et relancer dans l'ordre
docker exec -it gestionsprojet-auth-service-1 npx sequelize-cli db:seed:undo:all
docker exec -it gestionsprojet-auth-service-1 npx sequelize-cli db:seed --seed 20251017154139-roles.js
docker exec -it gestionsprojet-auth-service-1 npx sequelize-cli db:seed --seed 20251017154210-permissions.js
docker exec -it gestionsprojet-auth-service-1 npx sequelize-cli db:seed --seed 20251017160642-utilisateurs.js
```

#### 4. Frontend inaccessible
```bash
# Rebuild du frontend
cd frontend/frontend-gestion-projets
docker-compose build frontend-gestion-projets --no-cache
```

### Logs de Débogage

```bash
# Logs Auth Service
docker-compose logs auth-service

# Logs Project Service  
docker-compose logs manage_projets_service

# Logs Frontend
docker-compose logs frontend-gestion-projets

# Logs Base de données
docker-compose logs postgres
```

## 🤝 Contributions

Les contributions sont les bienvenues ! Processus :

1. **Fork** le projet
2. **Créez une branche** : `git checkout -b feature/nouvelle-fonctionnalite`
3. **Commitez** : `git commit -m 'Ajout: nouvelle fonctionnalité'`
4. **Push** : `git push origin feature/nouvelle-fonctionnalite`
5. **Ouvrez une Pull Request**

### Standards de Code

- **TypeScript** pour tout nouveau code
- **ESLint** et règles de linting respectées
- **Tests** pour les nouvelles fonctionnalités
- **Documentation** mise à jour

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :

1. **Consultez** la section dépannage ci-dessus
2. **Vérifiez** les logs Docker
3. **Ouvrez une issue** sur le repository

---

<div align="center">

**Gestion Projets** - Plateforme collaborative de gestion de projets 🚀

*Développé avec Node.js, React, TypeScript & Docker*

</div>