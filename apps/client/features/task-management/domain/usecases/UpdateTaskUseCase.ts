import { UpdateTaskInput } from "@repo/shared";
import { ITaskRepository } from "../repository/ITaskRepository";
import { Task } from "../entities/Task";

export class UpdateTaskUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(id: string, payload: UpdateTaskInput): Promise<Task> {
    return this.taskRepository.updateTask(id, payload);
  }
}