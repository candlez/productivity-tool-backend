import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import type { HashedUser, InputUser, PublicUser } from "../types/user.types.js";
import type { UserService } from "./user.service.js";


export class AuthService {
    constructor(private userService: UserService) {}

    public async signup(inputUser: InputUser): Promise<PublicUser> {

        const salt: string = await bcrypt.genSalt();
        const passwordHash: string = await bcrypt.hash(inputUser.password, salt);

        const hashedUser: HashedUser = {
            firstName: inputUser.firstName,
            lastName: inputUser.lastName,
            email: inputUser.email,
            passwordHash
        }
        return await this.userService.createUser(hashedUser);
    }
}