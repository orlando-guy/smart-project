import { useQuery } from "@tanstack/react-query";
import { getProjectMembersUseCase } from "../../di/project.container";

export function useProjectMembers(projectId: string) {
  return useQuery({
    queryKey: ["project_members", projectId],
    queryFn: () => getProjectMembersUseCase.execute(projectId),
    enabled: Boolean(projectId),
  });
}
