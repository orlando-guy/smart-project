import { QueryBuilder } from "../query/QueryBuilder";
import { IProjectRepository } from "../repositories/IProjectRepository";

export class GetProjectUseCase {
    constructor(
        private readonly repository: IProjectRepository
    ) {}

    execute(query?: QueryBuilder) {
        return this.repository.getProjects(query)
    }
}