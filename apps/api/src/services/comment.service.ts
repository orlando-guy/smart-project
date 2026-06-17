import { CreateCommentInput, PaginationInput, PaginatedResponse } from "@repo/shared";
import { generateErrorWithStatusCode } from "src/lib/utils";
import { CommentRepository } from "src/repositories/comment.repository";
import { ProjectRepository } from "src/repositories/project.repository";
import { TaskRepository } from "src/repositories/task.repository";

export class CommentService {
    constructor(
        private readonly commentRepository = new CommentRepository(),
        private readonly taskRepository = new TaskRepository(),
        private readonly projectRepository = new ProjectRepository()
    ) {}

    async createComment(taskId: string, authorId: string, data: CreateCommentInput) {
        const task = await this.taskRepository.findById(taskId);
        if (!task) {
            generateErrorWithStatusCode("La tâche n'existe pas", 404);
        }

        const isMember = await this.projectRepository.isMember(task!.projectId, authorId);
        if (!isMember) {
            generateErrorWithStatusCode("Vous n'êtes pas membre de ce projet", 403);
        }

        try {
            return await this.commentRepository.create(taskId, authorId, data);
        } catch (error) {
            generateErrorWithStatusCode("Impossible de créer le commentaire", 500, error);
        }
    }

    async getCommentsForTask(taskId: string, paginationParams: PaginationInput) {
        const task = await this.taskRepository.findById(taskId);
        if (!task) {
            generateErrorWithStatusCode("La tâche n'existe pas", 404);
        }

        const { limit, p, ord } = paginationParams;
        const skip = (p - 1) * limit;

        try {
            const [data, total] = await Promise.all([
                this.commentRepository.findManyByTaskId(taskId, {
                    limit,
                    skip,
                    orderBy: ord
                }),
                this.commentRepository.countByTaskId(taskId)
            ]);

            return {
                data,
                count: data.length,
                meta: {
                    total,
                    page: p,
                    limit: limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            generateErrorWithStatusCode("Impossible de récupérer les commentaires", 500, error);
        }
    }
}
