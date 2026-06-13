import { Project } from "../entities/Project";
import { IProjectRepository } from "../repositories/IProjectRepository";
import { ProjectInput } from "@repo/shared";

export class UpdateProjectUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(id: string, payload: ProjectInput): Promise<Project> {
    return this.repository.update(id, payload);
  }
}
