# API Reference (Frontend-Facing)

Ce document détaille comment consommer l'API backend depuis l'application frontend.

## Base URL & Authentification
- **Base URL** : `process.env.NEXT_PUBLIC_API_URL`
- **Auth** : Toutes les routes nécessitent un token JWT envoyé dans l'en-tête `Authorization: Bearer <token>`. L'intercepteur Axios (`apps/client/lib/api.ts`) gère automatiquement cet en-tête.

## Utilisation avec React Query

Privilégiez l'utilisation des hooks personnalisés créés dans les différentes features (`application/hooks`).

```typescript
// Exemple type de consommation
const { data, isLoading } = useProjectTasks(projectId);
```

## Endpoints clés

### 1. Projets (`/project`)
- `GET /api/project/:id` : Détails du projet.
- `GET /api/project/:id/members` : Liste des membres du projet.
- `POST /api/project/add-new-member` : Ajouter un membre au projet.

### 2. Tâches (`/tasks`)
- `GET /api/project/:projectId/tasks` : Récupérer toutes les tâches d'un projet.
- `POST /api/task/create` : Créer une tâche.
- `PUT /task/:id` : Mettre à jour une tâche (incluant multi-assignation).
- `PATCH /task/:id/status` : Changer le statut d'une tâche.
- `DELETE /task/:id` : Supprimer une tâche.

### 3. Commentaires (`/tasks/:taskId/comments`)
- `POST /api/tasks/:taskId/comments` : Ajouter un commentaire.
- `GET /api/tasks/:taskId/comments?limit=10&p=1&ord=desc` : Lister les commentaires paginés.

## Format de Réponse Générique

La plupart des endpoints retournent une structure standard :

```json
{
  "success": true,
  "data": { ... }, // Ou tableau de données
  "meta": { ... }  // Pour les requêtes paginées
}
```

*Note : Consultez les définitions Swagger (`/docs` sur l'API) pour la documentation technique exhaustive.*
