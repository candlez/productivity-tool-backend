import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { toPublicUser, type HashedUser, type InputUser, type LoginUser, type PublicUser, type User } from "../types/user.types.js";
import { type UserService } from "./user.service.js";
import { environment } from "../environment.js"; 

/**
 * // TODO write this documentation
 */
export class AuthService {
    public static readonly MAX_AGE = 3 * 24 * 60 * 60; // 3 days in seconds

    public static readonly TOKEN_NAME = "productivity_tool_jwt";

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


    public async login(loginUser: LoginUser): Promise<[string, PublicUser]> {

        const user: User | null = await this.userService.getUserByEmail(loginUser.email);
        if (user === null) {
            // TODO throw error? need to return a 4xx code to user
            throw new Error("placeholder");
        }

        const passwordMatches = await bcrypt.compare(loginUser.password, user.passwordHash);
        if (!passwordMatches) {
            // TODO throw error? need to return a 4xx code to user
            throw new Error("placeholder");
        }

        const publicUser: PublicUser = toPublicUser(user);
        // I believe the default algorithm is HS256
        const token: string = jwt.sign(publicUser, environment.JWT_SECRET, { expiresIn: AuthService.MAX_AGE });

        return [token, publicUser];
    }
}