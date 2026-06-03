import { IProjectRepository } from "../repositories/IProjectRepository";

export class DeleteProjectUseCase {
    constructor(
        private readonly repository: IProjectRepository
    ) {}

    async execute(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
