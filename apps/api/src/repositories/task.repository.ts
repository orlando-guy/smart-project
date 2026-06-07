import { getPrisma } from "@repo/database";
import { TaskInput } from "@repo/shared";

export class TaskRepository {
    readonly #prisma = getPrisma();

    async create(taskData: TaskInput) {
        return this.#prisma.task.create({
            data: {
                title: taskData.title,
                description: taskData.description,
                endDate: taskData.endDate ? new Date(taskData.endDate) : null,
                priority: taskData.priority,
                statut: taskData.statut,
                projectId: taskData.projectId,
                assignedUserId: taskData.assignedUserId,
            },
        });
    }
}
