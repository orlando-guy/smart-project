import { IProjectRepository } from "../repositories/IProjectRepository";

export class GetSingleProjectUseCase {
    constructor(
        private readonly projectRepository: IProjectRepository
    ) {}

    execute(projectId: string) {
        return this.projectRepository.getSingleProject(projectId);
    }
}