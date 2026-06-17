import { api } from "@/lib/api";
import { Comment } from "../../domain/entities/Comment";
import { ICommentRepository } from "../../domain/repository/ICommentRepository";
import { CreateCommentInput } from "@repo/shared";

export class CommentRepository implements ICommentRepository {
  async createComment(taskId: string, data: CreateCommentInput): Promise<Comment> {
    const result = await api.post(`/tasks/${taskId}/comments`, data);
    return result.data?.data ?? result.data;
  }

  async getComments(taskId: string, params: PaginationInput): Promise<PaginatedResponse<Comment>> {
    const { limit, p, ord } = params;
    const result = await api.get(`/tasks/${taskId}/comments`, {
        params: { limit, p, ord }
    });
    return result.data;
  }
}
