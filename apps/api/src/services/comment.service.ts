import { CreateCommentInput } from "@repo/shared";
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
        // Check task
        const task = await this.taskRepository.findById(taskId);
        if (!task) {
            generateErrorWithStatusCode("La tâche n'existe pas", 404);
        }

        // Check membership in project
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
}
