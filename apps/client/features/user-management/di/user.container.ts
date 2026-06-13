import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { GetUsersUseCase } from "../domain/usecases/GetUsersUseCase";

const userRepository = new UserRepository()

export const getAllUsersUseCase = new GetUsersUseCase(userRepository);