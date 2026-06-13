import { IProjectRepository } from "../repositories/IProjectRepository";

export class AddMemberToProjectUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(projectId: string, memberId: string): Promise<void> {
    return this.repository.addMember(projectId, memberId);
  }
}
