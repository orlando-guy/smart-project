# SmartProject Client

Application frontend pour la plateforme de gestion de projets étudiants, développée avec **Next.js 15**, **TypeScript**, et **Shadcn UI**.

## 🏗️ Architecture : Clean Architecture

Ce projet suit une **Clean Architecture** stricte pour garantir la testabilité et la maintenance sur le long terme. Le code est organisé par fonctionnalités dans le dossier `features/`.

### Structure d'une Feature (`features/<feature-name>/`)
Chaque fonctionnalité est isolée et contient ses propres couches :

- **`domain/`** : Contrat pur (Entités, Interfaces Repository, UseCases). Aucune dépendance externe.
- **`infrastructure/`** : Implémentation concrète (API Repository appelant Axios/API).
- **`application/`** : Couche d'orchestration (Hooks React Query/Mutations).
- **`presentation/`** : UI pure (Pages, Composants, Modals).

### 🛠️ Tech Stack
- **Framework** : Next.js 15 (App Router).
- **Langage** : TypeScript (Strict mode).
- **Data Fetching** : TanStack Query (React Query).
- **Formulaires** : React Hook Form + Zod (Validation partagée via `@repo/shared`).
- **UI** : Tailwind CSS + Shadcn UI.
- **Drag & Drop** : `@dnd-kit/core` (pour le Kanban).

## 🚀 Getting Started

1. **Prérequis** : Node.js 20+, pnpm.
2. **Installation** : `pnpm install`
3. **Variables d'environnement** : Copier `.env.example` en `.env` et configurer `NEXT_PUBLIC_API_URL`.
4. **Lancement** : `pnpm dev`

## 📘 Guide du Développeur
- **Ajout d'une fonctionnalité** : Commencez toujours par le schéma Zod dans `@repo/shared`.
- **Ajout d'API** : Implémentez l'interface dans `domain/repository` puis l'implémentation dans `infrastructure/repositories`.
- **Tests** : Le projet utilise **Vitest**. Exécutez `pnpm test:run` avant chaque commit.
- **Convention Commit** : Utilisez les standards Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).

Pour plus de détails, consultez `API_REFERENCE.md` dans ce dossier.
