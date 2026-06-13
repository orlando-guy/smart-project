import { IProjectRepository } from "../repositories/IProjectRepository";

export class GetProjectMembersUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(projectId: string) {
    return this.repository.getMembers(projectId);
  }
}
