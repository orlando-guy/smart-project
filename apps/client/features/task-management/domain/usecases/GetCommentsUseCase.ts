import { ICommentRepository } from "../repository/ICommentRepository";
import { PaginationInput, PaginatedResponse } from "@repo/shared";
import { Comment } from "../entities/Comment";

export class GetCommentsUseCase {
  constructor(private readonly repository: ICommentRepository) {}

  async execute(taskId: string, params: PaginationInput): Promise<PaginatedResponse<Comment>> {
    return this.repository.getComments(taskId, params);
  }
}
