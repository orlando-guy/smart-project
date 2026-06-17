import { Comment } from "../entities/Comment";
import { CreateCommentInput, PaginationInput, PaginatedResponse } from "@repo/shared";

export interface ICommentRepository {
    createComment(taskId: string, data: CreateCommentInput): Promise<Comment>;
    getComments(taskId: string, params: PaginationInput): Promise<PaginatedResponse<Comment>>;
}
