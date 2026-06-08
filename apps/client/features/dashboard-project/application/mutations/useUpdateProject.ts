import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectInput as UpdateProjectDto } from "@repo/shared";
import { updateProjectUseCase } from "../../di/project.container";
import { Project } from "../../domain/entities/Project";

type UpdateProjectPayload = {
    id: string;
    data: UpdateProjectDto;
};

export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateProjectPayload) => updateProjectUseCase.execute(id, data),
        onSuccess: (updatedProject, { id }) => {
            queryClient.setQueriesData<Project[]>({ queryKey: ["projects"] }, (oldData) => {
                if (!oldData) return [];
                return oldData.map((project) => (
                    project.id === id
                        ? new Project(
                            updatedProject.id,
                            updatedProject.titre,
                            updatedProject.description,
                            updatedProject.leadId,
                            updatedProject.createdAt,
                            updatedProject.lead,
                            updatedProject.teams,
                            updatedProject.tasks
                        )
                        : project
                ));
            });

            queryClient.setQueryData(["single_project", id], updatedProject);
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["single_project", id] });
        },
    });
}
