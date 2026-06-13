import { Task } from "../entities/Task";

export interface ITaskRepository {
    getProjectTasks(
        projectId: string
    ): Promise<Task[]>

    updateTaskStatus(taskId: string, status: string): Promise<Task>;
}