import { useQuery } from "@tanstack/react-query";
import { getCommentsUseCase } from "../../di/comment.container";
import { PaginationInput } from "@repo/shared";

export function useComments(taskId: string, params: PaginationInput) {
  return useQuery({
    queryKey: ["task_comments", taskId, params],
    queryFn: () => getCommentsUseCase.execute(taskId, params),
    enabled: Boolean(taskId),
  });
}
