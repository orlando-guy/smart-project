import { Task } from "@/features/task-management/domain/entities/Task";

export class Project {
    constructor(
        public id: string,
        public titre: string,
        public description: string,
        public leadId: string,
        public createdAt: string,
        public lead?: {
            name: string
        },
        public teams?: {
            user: {
                id: string;
                email: string;
                name: string;
            };
        }[],
        public tasks?: Task[]
    ) { }
}