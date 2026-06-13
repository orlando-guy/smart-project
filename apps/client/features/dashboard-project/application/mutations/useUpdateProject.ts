import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProjectUseCase } from "../../di/project.container";
import { ProjectInput } from "@repo/shared";
import { toast } from "sonner";
import { Project } from "../../domain/entities/Project";

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProjectInput }) =>
      updateProjectUseCase.execute(id, payload),
    
    // 1. Avant l'exécution de la requête API
    onMutate: async (variables) => {
      const queryKey = ["single_project", variables.id];

      // On annule les rafraîchissements en cours pour ne pas écraser notre mise à jour optimiste
      await queryClient.cancelQueries({ queryKey });

      // On sauvegarde l'état actuel (snapshot) pour un éventuel retour en arrière
      const previousProject = queryClient.getQueryData<Project>(queryKey);

      // On met à jour le cache immédiatement avec les nouvelles données
      if (previousProject) {
        queryClient.setQueryData<Project>(queryKey, {
          ...previousProject,
          titre: variables.payload.title,
          description: variables.payload.description,
        });
      }

      // On retourne le contexte avec le snapshot
      return { previousProject };
    },

    // 2. En cas d'erreur réseau ou serveur
    onError: (error: any, variables, context) => {
      // Rollback : on restaure les anciennes données si on a un snapshot
      if (context?.previousProject) {
        queryClient.setQueryData(
          ["single_project", variables.id],
          context.previousProject
        );
      }
      toast.error(error.message || "Erreur lors de la mise à jour du projet");
    },

    // 3. En cas de succès
    onSuccess: () => {
      // Invalider la liste globale des projets
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Projet mis à jour avec succès");
    },

    // 4. Qu'il y ait succès ou erreur, on synchronise avec le serveur
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["single_project", variables.id],
      });
    },
  });
}
