import type { UUID } from "crypto";

import { UserRepository } from "../repositories/user.repo.js";
import { type HashedUser, type PredicateUser, type User } from "../types/user.types.js";
import type { IDService } from "./id.service.js";
import { ContextService } from "./context.service.js";

/** 
 * handles logic and functionality pertaining to Users
 */
export class UserService {
    constructor(private userRepository: UserRepository, private idServices: IDService) {}

    public async getAllUsers(): Promise<User[]> {

        ContextService.getLogger().info(`Getting all users`);
        const users = await this.userRepository.getAllUsers();
        return users;
    }


    public async createUser(hashedUser: HashedUser): Promise<User> {

        const id: UUID = this.idServices.createUUID();
        const createdAt: Date = new Date(); // this will provide the current time
        const user: User = {
            id: id,
            firstName: hashedUser.firstName,
            lastName: hashedUser.lastName,
            email: hashedUser.email,
            passwordHash: hashedUser.passwordHash,
            createdAt: createdAt
        }
        ContextService.getLogger().info(`Creating user: ${id} for email: ${hashedUser.email}`);
        await this.userRepository.insertUser(user);
        return user;
    }

    
    /**
     * for now, this method will simply do what the controller needs it to do
     * in the future, it may become necessary to make this method more general.
     * that would involve it taking a PredicateUser as an argument and returning
     * Promise<void>
     */
    public async updateUser(id: UUID, hashedUser: HashedUser): Promise<void> {

        const predicateUser: PredicateUser = {
            firstName: hashedUser.firstName,
            lastName: hashedUser.lastName,
            email: hashedUser.email,
            passwordHash: hashedUser.passwordHash,
        }
        ContextService.getLogger().info(`Updating user: ${id}`);
        await this.userRepository.updateUser(id, predicateUser);
    }


    public async getUserByEmail(email: string): Promise<User | null> {

        ContextService.getLogger().info(`Getting user for email: ${email}`);
        return await this.userRepository.getUserByEmail(email);
    }


    public async getUserById(id: UUID): Promise<User | null> {

        ContextService.getLogger().info(`Getting user: ${id}`);
        return await this.userRepository.getUserById(id);
    }


    public async deleteUser(id: UUID): Promise<void> {

        ContextService.getLogger().info(`Deleting user: ${id}`);
        await this.userRepository.deleteUser(id);
    }
}