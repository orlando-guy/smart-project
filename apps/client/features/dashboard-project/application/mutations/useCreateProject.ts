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
            queryClient.setQueryData(
                ["projects"],
                (oldData: Project[] = []) => [
                    ...oldData,
                    newProject
                ]
            )

            // Synchronisation backend
            queryClient.invalidateQueries({
                queryKey: ['projects']
            })
        }
    })
}