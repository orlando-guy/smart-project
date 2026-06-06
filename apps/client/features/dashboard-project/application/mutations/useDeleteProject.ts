import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProjectUseCase } from "../../di/project.container";
import { Project } from "../../domain/entities/Project";

export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteProjectUseCase.execute(id),
        onSuccess: (_, id) => {
            // Optimistic update of all queries starting with 'projects'
            queryClient.setQueriesData<Project[]>({ queryKey: ['projects'] }, (oldData) => {
                if (!oldData) return [];
                return oldData.filter((project) => project.id !== id);
            });

            // Synchroniser le backend
            queryClient.invalidateQueries({
                queryKey: ['projects']
            });
        }
    });
}
