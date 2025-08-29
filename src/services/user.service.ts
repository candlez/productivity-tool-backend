import { UserRepository } from "../repositories/user.repo.js";
import type { User } from "../types/user.types.js";

export class UserService {
    constructor(private userRepository: UserRepository) {}

    public async getAllUsers(): Promise<User[]> {
        return this.userRepository.getAllUsers();
    }
}