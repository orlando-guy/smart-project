import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommentUseCase } from "../../di/comment.container";
import { CreateCommentInput } from "@repo/shared";
import { toast } from "sonner";

export function useCreateComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentInput) => createCommentUseCase.execute(taskId, data),
    onSuccess: () => {
      // Invalider le cache des commentaires pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ["task_comments", taskId] });
      toast.success("Commentaire publié");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la publication");
    },
  });
}
