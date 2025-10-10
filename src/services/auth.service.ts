import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { toPublicUser, type HashedUser, type InputUser, type LoginUser, type PublicUser, type User } from "../types/user.types.js";
import { type UserService } from "./user.service.js";
import { environment } from "../environment.js"; 
import { UnauthorizedError } from "../types/error.types.js";

/**
 * Service class for authentication functionality such as generating tokens
 * and hashing passwords
 */
export class AuthService {
    public static readonly MAX_AGE = 3 * 24 * 60 * 60; // 3 days in seconds

    public static readonly TOKEN_NAME = "productivity_tool_jwt";

    constructor(private userService: UserService) {}

    public async hashUser(inputUser: InputUser): Promise<HashedUser> {

        const salt: string = await bcrypt.genSalt();
        const passwordHash: string = await bcrypt.hash(inputUser.password, salt);

        const hashedUser: HashedUser = {
            firstName: inputUser.firstName,
            lastName: inputUser.lastName,
            email: inputUser.email,
            passwordHash
        }
        return hashedUser;
    }


    public async signup(inputUser: InputUser): Promise<PublicUser> {

        const hashedUser: HashedUser = await this.hashUser(inputUser);
        const user: User = await this.userService.createUser(hashedUser);
        return toPublicUser(user);
    }


    public generateToken(publicUser: PublicUser): string {
        // I believe the default algorithm is HS256
        return jwt.sign(publicUser, environment.JWT_SECRET, { expiresIn: AuthService.MAX_AGE });
    } 


    public async login(loginUser: LoginUser): Promise<[string, PublicUser]> {

        const user: User | null = await this.userService.getUserByEmail(loginUser.email);
        if (user === null) {
            throw new UnauthorizedError("Username or Password is incorrect");
        }

        const passwordMatches = await bcrypt.compare(loginUser.password, user.passwordHash);
        if (!passwordMatches) {
            throw new UnauthorizedError("Username or Password is incorrect");
        }

        const publicUser: PublicUser = toPublicUser(user);

        const token = this.generateToken(publicUser);

        return [token, publicUser];
    }
}