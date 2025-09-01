import type { UUID } from "crypto";


import { UserRepository } from "../repositories/user.repo.js";
import { toPublicUser, type HashedUser, type PublicUser,type User } from "../types/user.types.js";
import type { IDService } from "./id.service.js";

export class UserService {
    constructor(private userRepository: UserRepository, private idServices: IDService) {}

    public async getAllUsers(): Promise<PublicUser[]> {
        const users = await this.userRepository.getAllUsers();
        return users.map(toPublicUser);
    }


    public async createUser(hashedUser: HashedUser): Promise<PublicUser> {

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
        return {
            id: id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };
    }
}