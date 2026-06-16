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
                assignedUsers: {
                    connect: taskData.assignedUserIds.map(id => ({ id }))
                }
            },
            include: {
                assignedUsers: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
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
                },
                assignedUsers: {
                    select: {
                        id: true,
                        name: true,
                        email: true
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

    async findByProjectId(projectId: string) {
        return this.#prisma.task.findMany({
            where: { projectId },
            include: {
                assignedUsers: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { endDate: 'asc' }
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
                assignedUsers: taskData.assignedUserIds ? {
                    set: taskData.assignedUserIds.map(id => ({ id }))
                } : undefined
            },
            include: {
                assignedUsers: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    }
}
