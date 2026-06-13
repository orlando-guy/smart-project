import { Task } from "../entities/Task";
import { TaskInput } from "@repo/shared";

export interface ITaskRepository {
    getProjectTasks(
        projectId: string
    ): Promise<Task[]>

    updateTaskStatus(taskId: string, status: string): Promise<Task>;

    createTask(payload: TaskInput): Promise<Task>;
}