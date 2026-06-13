import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjectTasksUseCase, updateTaskStatusUseCase } from "../../di/task.container";
import { Task, TaskStatus } from '../../domain/entities/Task';

import { toast } from "sonner";

export function useProjectTasks(projectId: string) {
  return useQuery({
    queryKey: ["project_tasks", projectId],
    queryFn: () => getProjectTasksUseCase.execute(projectId),
    enabled: Boolean(projectId),
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      updateTaskStatusUseCase.execute(taskId, status),
    
    onMutate: async ({ taskId, status }) => {
      // Annuler les rafraîchissements
      await queryClient.cancelQueries({ queryKey: ["project_tasks"] });

      // Snapshot pour rollback
      const previousTasks = queryClient.getQueryData<Task[]>(["project_tasks"]);

      // Mise à jour optimiste
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(["project_tasks"], (old) => 
          old?.map(t => t.id === taskId ? { ...t, statut: status as TaskStatus } : t)
        );
      }

      return { previousTasks };
    },

    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["project_tasks"], context.previousTasks);
      }
      toast.error("Erreur lors du déplacement de la tâche");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project_tasks"] });
    },
  });
}
