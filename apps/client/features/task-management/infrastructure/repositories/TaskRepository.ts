import { api } from "@/lib/api";
import { Task } from "../../domain/entities/Task";
import { ITaskRepository } from "../../domain/repository/ITaskRepository";


export class TaskRepository implements ITaskRepository {
  async getProjectTasks(projectId: string): Promise<Task[]> {
    const result = await api.get(`/project/${projectId}/tasks`);
    return result.data?.data ?? result.data;
  }

  async updateTaskStatus(taskId: string, status: string): Promise<Task> {
    const result = await api.patch(`/task/${taskId}/status`, { statut: status });
    return result.data?.data ?? result.data;
  }
}
