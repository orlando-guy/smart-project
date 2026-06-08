export type ProjectPriority = "MUST" | "SHOULD" | "COULD" | "WONT";
export type TaskStatus = "ACHIEVED" | "ONGOING" | "NOT_STARTED";

export type ProjectMember = {
    user: {
        id: string;
        email: string;
        name: string;
    };
};

export type ProjectTask = {
    description: string | null;
    title: string;
    endDate: string | Date | null;
    priority: ProjectPriority;
    statut: TaskStatus;
    assignedUser: {
        id: string;
        name: string;
    };
};

export class Project {
    constructor(
        public id: string,
        public titre: string,
        public description: string,
        public leadId: string | null,
        public createdAt: string,
        public lead?: {
            name: string;
            email?: string;
        },
        public teams?: ProjectMember[],
        public tasks?: ProjectTask[]
    ) { }
}
