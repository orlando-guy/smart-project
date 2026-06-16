import { api } from "@/lib/api";
import { Task } from "../../domain/entities/Task";
import { ITaskRepository } from "../../domain/repository/ITaskRepository";
import { TaskInput, UpdateTaskInput } from "@repo/shared";


export class TaskRepository implements ITaskRepository {
  async getProjectTasks(projectId: string): Promise<Task[]> {
    const result = await api.get(`/project/${projectId}/tasks`);
    return result.data?.data ?? result.data;
  }

  async updateTaskStatus(taskId: string, status: string): Promise<Task> {
    const result = await api.patch(`/task/${taskId}/status`, { statut: status });
    return result.data?.data ?? result.data;
  }

  async updateTask(id: string, payload: UpdateTaskInput): Promise<Task> {
    const result = await api.put(`/task/${id}`, payload);
    return result.data?.data ?? result.data;
  }

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/task/${id}`);
  }

  async createTask(payload: TaskInput): Promise<Task> {
    const result = await api.post('/task/create', payload);
    return result.data?.data ?? result.data;
  }
}
