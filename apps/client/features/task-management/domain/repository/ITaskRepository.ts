import { Task } from "../entities/Task";
import { TaskInput, UpdateTaskInput } from "@repo/shared";

export interface ITaskRepository {
    getProjectTasks(
        projectId: string
    ): Promise<Task[]>

    updateTaskStatus(taskId: string, status: string): Promise<Task>;

    updateTask(id: string, payload: UpdateTaskInput): Promise<Task>;

    deleteTask(id: string): Promise<void>;

    createTask(payload: TaskInput): Promise<Task>;
}