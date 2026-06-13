import { TaskInput } from "@repo/shared";
import { generateErrorWithStatusCode } from "src/lib/utils";
import { ProjectRepository } from "src/repositories/project.repository";
import { TaskRepository } from "src/repositories/task.repository";
import { UserRepository } from "src/repositories/user.repository";
import { NotificationService } from "./notification.service";

export class TaskService {
    constructor(
        private readonly taskRepository = new TaskRepository(),
        private readonly projectRepository = new ProjectRepository(),
        private readonly userRepository = new UserRepository(),
        private readonly notificationService = new NotificationService()
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

            // Notification d'assignation
            await this.notificationService.notifyTaskAssigned(taskData.assignedUserId, task.title);

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

    async updateTask(taskId: string, userId: string, updateData: Partial<TaskInput>) {
        const task = await this.taskRepository.findById(taskId);

        if (!task) {
            generateErrorWithStatusCode("La tâche que vous voulez modifier n'existe pas", 404);
        }

        // Seul le responsable du projet ou la personne assignée peut modifier la tâche
        const isLead = task!.project.leadId === userId;
        const isAssigned = task!.assignedUserId === userId;

        if (!isLead && !isAssigned) {
            generateErrorWithStatusCode("Vous n'avez pas la permission de modifier cette tâche", 403);
        }

        // Si on change l'assignation, vérifier que le nouvel utilisateur existe et est membre du projet
        if (updateData.assignedUserId && updateData.assignedUserId !== task!.assignedUserId) {
            const user = await this.userRepository.findById(updateData.assignedUserId);
            if (!user) {
                generateErrorWithStatusCode("L'utilisateur assigné n'existe pas", 404);
            }

            const isMember = await this.projectRepository.isMember(task!.projectId, updateData.assignedUserId);
            if (!isMember) {
                generateErrorWithStatusCode("Le nouvel utilisateur assigné n'est pas membre de ce projet", 403);
            }
        }

        try {
            const updatedTask = await this.taskRepository.update(taskId, updateData);
            return updatedTask;
        } catch (error) {
            generateErrorWithStatusCode(
                "Impossible de modifier la tâche. Une erreur est survenue.",
                500,
                error
            );
        }
    }

    async updateTaskStatus(taskId: string, userId: string, statut: any) {
        // La logique de permission est la même que pour updateTask
        return this.updateTask(taskId, userId, { statut });
    }

    async getProjectTasks(projectId: string) {
        const isProjectExists = await this.projectRepository.findById(projectId);
        if (!isProjectExists) {
            generateErrorWithStatusCode("Le projet pour lequel vous rechercher les tâches n'existe pas.", 404);
        }
        try {
            return await this.taskRepository.findByProjectId(projectId);
        } catch(error) {
            generateErrorWithStatusCode(
                "Impossible de trouver les tâches. Une erreur est survenue.",
                500,
                error
            );
        }
    }
}
