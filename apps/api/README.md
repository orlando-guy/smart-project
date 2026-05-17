## 🚀 API Backend - Clean Architecture & Turborepo
Ce projet est l'API REST de notre écosystème, propulsée par __Node.js, Express, TypeScript, Prisma (SQLite) et Zod__. Elle est intégrée au sein de notre monorepo Turborepo.


## 🏗️ Architecture du Code
L'API suit une Architecture en Couches (Layered Architecture) stricte pour garantir la testabilité, la séparation des responsabilités et l'évolutivité.

```
src/
├── config/         # Variables d'environnement validées par Zod
├── controllers/    # Gestion HTTP (Interception req, renvoi res)
├── middlewares/    # Sécurité, Authentification JWT, Gestion des erreurs
├── repositories/   # Couche Modèle / Abstraction de l'ORM Prisma
├── routes/         # Définition des endpoints et schémas de validation
└── services/       # Logique métier pure (indépendante d'Express et Prisma)
```

## 🔁 Flux nominal d'une requête HTTP :
`Client HTTP` ➡️ `Route` (Validation Zod) ➡️ `Middleware` ➡️ `Contrôleur` ➡️ `Service` (Logique Métier) ➡️ `Repository` (Prisma) ➡️ `Base de données`.


## 🛠️ Prérequis et Installation## 1. Variables d'environnement
Créez un fichier `.env` à la racine de ce dossier (`apps/api/.env`) en vous basant sur l'exemple suivant :

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=generer_une_cle_secrete_de_minimum_32_caracteres
DATABASE_URL=file:../../packages/database/prisma/dev.db
```

## 2. Initialisation de la Base de données (SQLite)
Avant de lancer l'API, vous devez générer le client Prisma et appliquer les migrations depuis la racine du monorepo ou dans le dossier dédié :

```bash
# Depuis la racine du monorepo
npx turbo db:migrate
# Ou directement dans packages/database
npx prisma migrate dev
```

## 🚀 Commandes Disponibles
Toutes les commandes peuvent être lancées depuis la racine du monorepo via Turborepo, ou directement dans ce dossier :

* `npm run dev` : Démarre le serveur Express en mode développement avec rechargement à chaud (Hot Reload via `tsx`).
* `npm run build`: Compile le projet TypeScript vers le dossier `dist/` pour la production.
* `npm run test` : Exécute la suite de tests unitaires via Vitest.
* `npm run test:watch` : Lance les tests en mode observation.

------------------------------
## 🔐 Règles de Sécurité et Bonnes Pratiques## 1. Partage de Schémas (Zod)
Pour éviter la désynchronisation entre le client Next.js et l'API, aucun schéma de validation ou type de données utilisateur ne doit être codé en dur ici. Utilisez et enrichissez le package partagé `@repo/shared-schema`.
## 2. Routes Sécurisées (JWT)
Toute route nécessitant une authentification doit utiliser le middleware requireAuth. Ce middleware valide le token et injecte l'utilisateur authentifié de manière typée dans l'objet de requête Express :

```typescript
// Exemple dans un contrôleurconst
userId = req.user.id; // Entièrement typé grâce à Express.Request étendu
```

## 3. Logique Métier Isolée

* Les Contrôleurs ne font jamais de calculs ou de requêtes en base de données. Ils délèguent aux services.
* Les Services ne manipulent jamais les objets `req` ou `res` d'Express. Ils reçoivent des données brutes et retournent des objets JavaScript purs. Cela permet de les tester de manière isolée en quelques millisecondes.

## 🧪 Tests Unitaires
Les tests sont écrits avec Vitest. Le fonctionnement des Repositories (base de données) doit être simulé (mocké) dans les fichiers `.test.ts` afin de tester uniquement la logique algorithmique des services sans dépendance technique externe.
