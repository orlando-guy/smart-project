import { IUserRepository } from "../repository/IUserRepository";

export class GetUsersUseCase {
    constructor(
        private readonly repository: IUserRepository
    ) {}

    async execute() {
        return this.repository.getAllUsers();
    }
}