import { TaskInput } from "@repo/shared";
import { generateErrorWithStatusCode } from "src/lib/utils";
import { ProjectRepository } from "src/repositories/project.repository";
import { TaskRepository } from "src/repositories/task.repository";
import { UserRepository } from "src/repositories/user.repository";

export class TaskService {
    constructor(
        private readonly taskRepository = new TaskRepository(),
        private readonly projectRepository = new ProjectRepository(),
        private readonly userRepository = new UserRepository()
    ) {}

    async createTask(taskData: TaskInput) {
        // Verify project exists
        const project = await this.projectRepository.findById(taskData.projectId);
        if (!project) {
            generateErrorWithStatusCode("Le projet n'existe pas", 404);
        }

        // Verify assigned user exists
        const user = await this.userRepository.findById(taskData.assignedUserId);
        if (!user) {
            generateErrorWithStatusCode("L'utilisateur assigné n'existe pas", 404);
        }

        // Verify assigned user is a member of the project
        const isMember = await this.projectRepository.isMember(taskData.projectId, taskData.assignedUserId);
        if (!isMember) {
            generateErrorWithStatusCode("L'utilisateur assigné n'est pas membre de ce projet", 403);
        }

        try {
            const task = await this.taskRepository.create(taskData);
            return task;
        } catch (error) {
            generateErrorWithStatusCode(
                "Impossible de créer la tâche. Une erreur est survenue.",
                500,
                error
            );
        }
    }

    async deleteTask(taskId: string, userId: string) {
        const task = await this.taskRepository.findById(taskId);

        if (!task) {
            generateErrorWithStatusCode("La tâche que vous voulez supprimer n'existe pas", 404);
        }

        // Seul le responsable du projet ou la personne assignée peut supprimer la tâche
        const isLead = task!.project.leadId === userId;
        const isAssigned = task!.assignedUserId === userId;

        if (!isLead && !isAssigned) {
            generateErrorWithStatusCode("Vous n'avez pas la permission de supprimer cette tâche", 403);
        }

        try {
            await this.taskRepository.delete(taskId);
            return { success: true, message: "Tâche supprimée avec succès" };
        } catch (error) {
            generateErrorWithStatusCode(
                "Impossible de supprimer la tâche. Une erreur est survenue.",
                500,
                error
            );
        }
    }
}
