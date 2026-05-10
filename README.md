# smart-project

Plateforme web permettant aux étudiants de gérer leurs projets en équipe, suivre les tâches, livrable et feedbacks avec une interface intuitive et collaborative.
------------------------------

## 🚀 Smart Project Monorepo

Bienvenue sur le projet Smart Project. Ce dépôt est un monorepo géré avec Turborepo et pnpm. Il centralise un Frontend (Next.js), un Backend (Node.js/Express) et des packages de configuration partagés.

## 🛠 Architecture du projet

```
├── apps/
│   ├── client/       # Frontend Next.js (Port 3000)
│   └── api/          # Backend Node.js/Express (Port 4000)
├── packages/
│   ├── shared/       # Schémas Zod, Types TS et Logique métier partagée
│   └── config/       # Configurations communes (TypeScript, ESLint, etc.)
├── package.json      # Scripts racine et orchestration
└── pnpm-workspace.yaml
````

## ⚙️ Prérequis

* Node.js (v20+ recommandé)
* pnpm (v10+ recommandé) : `npm install -g pnpm`

## 📥 Installation

Pour installer toutes les dépendances du monorepo (applications et packages internes compris) :
```bash
pnpm install
```
Note : N'installez jamais de dépendances manuellement dans les sous-dossiers avec npm ou yarn. Utilisez toujours pnpm à la racine.
## 🚀 Lancement en développement
Pour lancer simultanément le Frontend et l'API :

```bash
pnpm dev
```

* Frontend : http://localhost:3000
* API : http://localhost:4000

> Proxy : Le frontend est configuré avec un rewrite Next.js. Tout appel vers /api/* sur le port 3000 est automatiquement redirigé vers l'API sur le port 4000, évitant ainsi les problèmes de CORS en local.

## 🏗 Ajouter une nouvelle fonctionnalité## 1. Partage de types et schémas
Si vous créez une nouvelle ressource (ex: `Product`), définissez toujours son schéma Zod dans `packages/shared/src/index.ts`. Cela garantit que le Front et le Back parlent le même langage.
## 2. Ajouter un package à une application
Pour ajouter le package `shared` à l'API ou au Client :

```bash
pnpm add "@repo/shared@workspace:*" --filter @repo/api
```

## 3. Variables d'environnement
* API : Créez un fichier `apps/api/.env`. La variable `PORT` est fixée à `4000` par défaut via `cross-env` dans les scripts.
* Client : Créez un fichier `apps/client/.env.local`.

## 📏 Bonnes Pratiques (Règles d'or)

   1. Isolation TypeScript : Chaque application possède son propre `tsconfig.json` qui étend la configuration de base `@repo/config/typescript/base.json`. Ne modifiez pas la base sans consulter l'équipe.
   2. Validation de données : Utilisez systématiquement les schémas Zod du package `shared` pour valider les `req.body` côté API et typer vos appels `fetch` côté Client.
   3. Zéro dépendance à la racine : La racine du projet ne doit contenir que des outils de développement globaux (Turbo, Prettier). Les bibliothèques de runtime (Express, Zod, React) doivent être installées dans leurs dossiers respectifs.
   4. CORS Stricte : L'API utilise une whitelist dynamique. En production, assurez-vous de définir `FRONTEND_URL` pour autoriser votre domaine.

## 📦 Build & Production

Pour tester le build de l'ensemble du projet :
```bash
pnpm build
```

Turborepo mettra en cache les packages non modifiés pour accélérer les builds futurs.


## 📑 Gestion des Commits (Conventionnel)
Nous utilisons les Conventional Commits. Chaque message de commit doit suivre cette structure :
`type(scope): description`

* __feat__: Une nouvelle fonctionnalité (ex: `feat(api): add user authentication`)
* __fix__: Une correction de bug (ex: `fix(client): repair login button`)
* __refactor__: Modification du code sans ajout de fonction ni correction (ex: `refactor(shared): optimize zod schemas`)
* __chore__: Maintenance ou mise à jour de dépendances.

## 🚀 Stratégie de Déploiement
Le projet est conçu pour être déployé de manière découplée :

   1. Frontend (Next.js) : Idéalement sur Vercel ou Netlify.
   * Variable requise : `API_URL` (URL de votre API de production).
   2. Backend (Node.js) : Sur Railway, Render, ou un VPS (Docker).
   * Variable requise : `FRONTEND_URL` (URL de votre frontend de production pour le CORS).
   
## Pipeline CI/CD
Turborepo est déjà configuré pour optimiser le déploiement. Seules les applications ayant subi des modifications (ou dont les dépendances `packages/*` ont changé) seront reconstruites lors du push.