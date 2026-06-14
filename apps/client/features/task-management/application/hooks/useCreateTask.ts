import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTaskUseCase } from "../../di/task.container";
import { TaskInput } from "@repo/shared";
import { toast } from "sonner";

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TaskInput) => createTaskUseCase.execute(payload),
    onSuccess: () => {
      // Invalider le cache des tâches pour ce projet
      queryClient.invalidateQueries({ queryKey: ["project_tasks", projectId] });
      toast.success("Tâche créée avec succès");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la création de la tâche");
    },
  });
}
