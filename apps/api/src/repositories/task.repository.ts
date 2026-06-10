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

    async findById(id: string) {
        return this.#prisma.task.findUnique({
            where: { id },
            include: {
                project: {
                    select: {
                        leadId: true
                    }
                }
            }
        });
    }

    async delete(id: string) {
        return this.#prisma.task.delete({
            where: { id }
        });
    }

    async update(id: string, taskData: Partial<TaskInput>) {
        return this.#prisma.task.update({
            where: { id },
            data: {
                title: taskData.title,
                description: taskData.description,
                endDate: taskData.endDate ? new Date(taskData.endDate) : undefined,
                priority: taskData.priority,
                statut: taskData.statut,
                assignedUserId: taskData.assignedUserId,
            },
        });
    }
}
