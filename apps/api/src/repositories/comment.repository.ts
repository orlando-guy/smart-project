import { getPrisma } from "@repo/database";
import { CreateCommentInput } from "@repo/shared";

export class CommentRepository {
    readonly #prisma = getPrisma();

    async create(taskId: string, authorId: string, data: CreateCommentInput) {
        return this.#prisma.comment.create({
            data: {
                description: data.description,
                taskId: taskId,
                authorId: authorId
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    async findManyByTaskId(taskId: string, options: { limit: number; skip: number; orderBy: 'asc' | 'desc' }) {
        return this.#prisma.comment.findMany({
            where: { taskId },
            take: options.limit,
            skip: options.skip,
            orderBy: { createdAt: options.orderBy },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    async countByTaskId(taskId: string) {
        return this.#prisma.comment.count({
            where: { taskId }
        });
    }
}
