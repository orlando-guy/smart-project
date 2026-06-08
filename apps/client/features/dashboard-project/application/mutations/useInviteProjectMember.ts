import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectRepository } from "../../infrastructure/repositories/ProjectRepository";

const projectRepository = new ProjectRepository();

export function useInviteProjectMember(projectId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => projectRepository.inviteMember(projectId, userId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["single_project", projectId] });
        },
    });
}
