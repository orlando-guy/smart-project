import { User } from "@/features/user-management/domain/entities/User";


export type ProjectPriority = "MUST" | "SHOULD" | "COULD" | "WONT";
export type TaskStatus = "ACHIEVED" | "ONGOING" | "NOT_STARTED";

export interface Task {
    id: string;
    title: string;
    description: string | null;
    endDate: Date | null;
    priority: ProjectPriority;
    statut: TaskStatus;
    projectId: string;
    assignedUserId: string;
    assignedUser?: User | null
}