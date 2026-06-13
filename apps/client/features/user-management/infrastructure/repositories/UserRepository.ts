import { api } from "@/lib/api";
import { IUserRepository } from "../../domain/repository/IUserRepository";
import { User } from "../../domain/entities/User";


export class UserRepository implements IUserRepository {
  async getAllUsers(): Promise<User[]> {
    const result = await api.get("/users/all");
    return result.data?.data ?? result.data;
  }
}

export const userRepository = new UserRepository();
