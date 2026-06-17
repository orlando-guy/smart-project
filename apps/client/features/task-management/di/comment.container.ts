import { CommentRepository } from "../infrastructure/repositories/CommentRepository";
import { CreateCommentUseCase } from "../domain/usecases/CreateCommentUseCase";
import { GetCommentsUseCase } from "../domain/usecases/GetCommentsUseCase";

const commentRepository = new CommentRepository();

export const createCommentUseCase = new CreateCommentUseCase(commentRepository);
export const getCommentsUseCase = new GetCommentsUseCase(commentRepository);
