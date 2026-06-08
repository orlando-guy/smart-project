import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProjectUseCase } from "../../di/project.container";
import { ProjectInput as CreateProjectDto} from "@repo/shared";
import { Project } from "../../domain/entities/Project";

export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateProjectDto) => createProjectUseCase.execute(payload),
        onSuccess: (newProject) => {
            // Mise à jour immédiate (Optimistic update)
            queryClient.setQueriesData<Project[]>(
                { queryKey: ["projects"] },
                (oldData = []) => [
                    ...oldData,
                    newProject as Project
                ]
            )

            // Synchronisation backend
            queryClient.invalidateQueries({
                queryKey: ['projects']
            })
        }
    })
}
