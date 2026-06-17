import { ICommentRepository } from "../repository/ICommentRepository";
import { CreateCommentInput } from "@repo/shared";
import { Comment } from "../entities/Comment";

export class CreateCommentUseCase {
  constructor(private readonly repository: ICommentRepository) {}

  async execute(taskId: string, data: CreateCommentInput): Promise<Comment> {
    return this.repository.createComment(taskId, data);
  }
}
