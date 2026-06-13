import { ITaskRepository } from "../repository/ITaskRepository";


export class GetProjectTasksUseCase {
  constructor(private readonly repository: ITaskRepository) {}

  async execute(projectId: string) {
    return this.repository.getProjectTasks(projectId);
  }
}
