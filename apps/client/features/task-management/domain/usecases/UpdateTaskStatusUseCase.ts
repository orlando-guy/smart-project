import { ITaskRepository } from "../repository/ITaskRepository";


export class UpdateTaskStatusUseCase {
  constructor(private readonly repository: ITaskRepository) {}

  async execute(taskId: string, status: string) {
    return this.repository.updateTaskStatus(taskId, status);
  }
}
