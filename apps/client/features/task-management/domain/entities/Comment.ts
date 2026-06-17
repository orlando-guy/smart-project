import { User } from "@/features/user-management/domain/entities/User";

export interface Comment {
    id: string;
    description: string;
    taskId: string;
    authorId: string;
    author: Pick<User, 'id' | 'name'>;
    createdAt: Date;
}
