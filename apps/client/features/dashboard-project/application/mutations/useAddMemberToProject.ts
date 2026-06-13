import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMemberToProjectUseCase } from "../../di/project.container";
import { toast } from "sonner";

export function useAddMemberToProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, memberId }: { projectId: string; memberId: string }) =>
      addMemberToProjectUseCase.execute(projectId, memberId),
    onSuccess: (_, variables) => {
      // Invalider le cache des membres pour ce projet
      queryClient.invalidateQueries({ queryKey: ["project_members", variables.projectId] });
      toast.success("Membre ajouté avec succès au projet");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de l'ajout du membre");
    },
  });
}
