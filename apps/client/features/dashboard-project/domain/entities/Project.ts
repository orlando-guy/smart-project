type ProjectPriority = "MUST" | "SHOULD" | "COULD" | "WONT";
type TaskStatus = "ACHIEVED" | "ONGOING" | "NOT_STARTED";

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
        public tasks?: {
            description: string | null;
            title: string;
            endDate: string | null;
            priority: ProjectPriority;
            statut: TaskStatus;
            assignedUser: {
                id: string;
                name: string;
            };
        }[]
    ) { }
}