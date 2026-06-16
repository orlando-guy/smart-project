import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskUseCase } from "../../di/task.container";
import { UpdateTaskInput } from "@repo/shared";
import { toast } from "sonner";
import { Task } from "../../domain/entities/Task";

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskInput }) =>
      updateTaskUseCase.execute(id, payload),
    
    onMutate: async ({ id, payload }) => {
      const queryKey = ["project_tasks", projectId];
      await queryClient.cancelQueries({ queryKey });

      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(queryKey, (old) =>
          old?.map((t) => (t.id === id ? { ...t, ...payload } : t))
        );
      }

      return { previousTasks };
    },

    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["project_tasks", projectId], context.previousTasks);
      }
      toast.error("Erreur lors de la mise à jour de la tâche");
    },

    onSuccess: () => {
      toast.success("Tâche mise à jour avec succès");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project_tasks", projectId] });
    },
  });
}
