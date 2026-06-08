import { ProjectInput as UpdateProjectDto } from '@repo/shared';
import { IProjectRepository } from "../repositories/IProjectRepository";

export class UpdateProjectUseCase {
    constructor(
        private readonly repository: IProjectRepository
    ) {}

    async execute(id: string, payload: UpdateProjectDto) {
        return this.repository.update(id, payload);
    }
}
