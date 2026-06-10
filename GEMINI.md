# 🚀 SmartProject - Monorepo Master Plan

Ce document définit les standards techniques, l'architecture et les protocoles d'interaction pour le développement du projet SmartProject. Il doit être scrupuleusement respecté pour chaque nouvelle fonctionnalité.

## 1. Monorepo Overview & Workspace Management

SmartProject est une plateforme full-stack de gestion de projets étudiants, orchestrée via **Turborepo** pour la gestion des tâches (build, dev, test, generate).

### 🗺️ Cartographie du Workspace
- **`apps/client`** : Application Frontend Next.js (Interface utilisateur).
- **`apps/api`** : API Backend Node.js Express (Logique métier & API).
- **`packages/database` (`@repo/database`)** : Source unique de vérité pour les données (Prisma ORM, SQLite).
- **`packages/shared` (`@repo/shared`)** : Noyau de validation partagé (Schémas Zod, Types, Constantes).

---

## 2. Apps & Packages Technical Specifications

### 💻 `apps/client` (Frontend)
- **Stack** : Next.js 15, TypeScript (mode strict), Shadcn UI, Vitest.
- **Pattern : Clean Architecture** :
    - `domain/` : Entités métier et interfaces de dépôts (IProjectRepository).
    - `application/` : Cas d'usage, Hooks React (React Query) et mutations.
    - `infrastructure/` : Implémentations concrètes (Repositories appelant l'API via Axios).
    - `presentation/` : Composants UI, Pages et Layouts.
- **Règle** : La couche UI ne doit jamais manipuler les données brutes de l'API sans passer par un Repository et un Cas d'usage.

### 🔌 `apps/api` (Backend)
- **Stack** : Node.js, Express, TypeScript, Vitest, Swagger.
- **Pattern : Layered Architecture** :
    - `routes/` : Points d'entrée, validation Zod (via `zod-express-middleware`) et documentation Swagger.
    - `controllers/` : Extraction des paramètres, appel aux services et réponse HTTP.
    - `services/` : Logique métier pure (orchestration, sécurité, erreurs métier).
    - `repositories/` : Seule couche autorisée à importer `@repo/database`.
- **Règle** : Utiliser l'injection de dépendances (Constructor Injection) pour faciliter le testage unitaire des services.

### 🗄️ `packages/database` (`@repo/database`)
- **Rôle** : Centralise le schéma Prisma et expose un client unique.
- **Adapter** : Utilise `better-sqlite3` pour des performances accrues en environnement local et CI.
- **Export** : Le package expose `getPrisma()` et les types générés automatiquement.

### 🛡️ `packages/shared` (`@repo/shared`)
- **Rôle** : Garantit le **End-to-End Type Safety**.
- **Validation** : Tous les payloads (Project, User, Login) sont définis ici via des schémas Zod.
- **Partage** : L'API les utilise pour valider les requêtes (`POST/PUT`) et le Client pour typer ses formulaires et ses appels API.

---

## 3. Coding Standards & Architectural Boundaries

### 🏗️ Frontières Architecturales
1. **Zéro couplage direct avec la DB** : Seul `@repo/api` (couche Repository) peut importer `@repo/database`.
2. **Contrat Zod** : Toute modification de structure de données doit commencer par `@repo/shared`.
3. **Méthodes de classe** : Dans l'API, les méthodes de contrôleurs doivent être des **arrow functions** pour éviter la perte de contexte (`this`).

### ⚠️ Gestion des Erreurs
- **API** : Utilisation de `generateErrorWithStatusCode` pour des réponses HTTP explicites (409 Conflict, 403 Forbidden, 404 Not Found).
- **Client** : Gestion des erreurs via l'intercepteur Axios pour la déconnexion automatique sur 401.

---

## 4. AI Persona & Interaction Protocol

### 🤖 Ton & Expertise
Tu agis en tant que **Senior Software Engineer**. Tu es concis, précis et focalisé sur la robustesse du code.

### 🔄 Protocole d'Impact (Monorepo Flow)
Pour chaque modification, analyse et propose les changements dans cet ordre :
1. **Schema DB** (`packages/database/prisma/schema.prisma`)
2. **Schema Validation** (`packages/shared/src/schemas/`)
3. **Logique API** (Service -> Controller -> Route -> Swagger)
4. **Logique Client** (Entity -> Repository -> UseCase -> Hook -> UI)

### 💎 Qualité du Code
- Code complet, typé (`interface` vs `any`), et prêt pour la prod.
- Tests unitaires systématiques pour toute nouvelle logique métier (Vitest).

---

## ⚙️ To Be Defined (À spécifier)
- Stratégie de déploiement (Docker vs Vercel/Railway).
- Gestion fine des rôles RBAC (Role-Based Access Control) au-delà du Project Lead.
- Cible de couverture de tests (80%+ recommandée pour la couche Service).
