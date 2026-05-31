import { IProjectRepository } from "../repositories/IProjectRepository";
import { ProjectInput as CreateProjectDto } from '@repo/shared';

export class CreateProjectUseCase {
    constructor(
        private readonly repository: IProjectRepository
    ) {}

    async execute(payload: CreateProjectDto) {
        return this.repository.create(payload);
    }
}