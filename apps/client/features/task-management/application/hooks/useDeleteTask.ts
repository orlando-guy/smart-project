import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTaskUseCase } from "../../di/task.container";
import { toast } from "sonner";
import { Task } from "../../domain/entities/Task";

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTaskUseCase.execute(taskId),
    
    onMutate: async (taskId) => {
      const queryKey = ["project_tasks", projectId];
      await queryClient.cancelQueries({ queryKey });

      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(queryKey, (old) =>
          old?.filter((t) => t.id !== taskId)
        );
      }

      return { previousTasks };
    },

    onError: (err, taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["project_tasks", projectId], context.previousTasks);
      }
      toast.error("Erreur lors de la suppression de la tâche");
    },

    onSuccess: () => {
      toast.success("Tâche supprimée avec succès");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project_tasks", projectId] });
    },
  });
}
