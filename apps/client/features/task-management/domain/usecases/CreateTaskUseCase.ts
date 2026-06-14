import { ITaskRepository } from "../repository/ITaskRepository";
import { TaskInput } from "@repo/shared";
import { Task } from "../entities/Task";

export class CreateTaskUseCase {
  constructor(private readonly repository: ITaskRepository) {}

  async execute(payload: TaskInput): Promise<Task> {
    return this.repository.createTask(payload);
  }
}
