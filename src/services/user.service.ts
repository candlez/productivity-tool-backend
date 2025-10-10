import type { UUID } from "crypto";

import { UserRepository } from "../repositories/user.repo.js";
import { type HashedUser, type PredicateUser, type User } from "../types/user.types.js";
import type { IDService } from "./id.service.js";

/** 
 * handles logic and functionality pertaining to Users
 */
export class UserService {
    constructor(private userRepository: UserRepository, private idServices: IDService) {}

    public async getAllUsers(): Promise<User[]> {

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
        await this.userRepository.updateUser(id, predicateUser);
    }


    public async getUserByEmail(email: string): Promise<User | null> {

        return await this.userRepository.getUserByEmail(email);
    }


    public async getUserById(id: UUID): Promise<User | null> {

        return await this.userRepository.getUserById(id);
    }


    public async deleteUser(id: UUID): Promise<void> {

        await this.userRepository.deleteUser(id);
    }
}