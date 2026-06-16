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
}
