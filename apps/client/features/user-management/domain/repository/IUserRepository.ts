import { User } from "../entities/User";

export interface IUserRepository {
  getAllUsers(): Promise<User[]>;
}