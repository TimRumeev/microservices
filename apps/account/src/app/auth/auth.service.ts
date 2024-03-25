import { Injectable } from "@nestjs/common";
import { RegisterDto } from "./auth.controller";
import { UserRepository } from "../user/repositories/user.repository";
import { UserEntity } from "../user/entities/user.entity";
import { UserRole } from "@courses/interfaces";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) {}
    async register({ email, password, displayName }: RegisterDto) {
        const oldUser = await this.userRepository.findUser(email);
        if (oldUser) {
            throw new Error("User already exists");
        }
        const uEntity = await new UserEntity({
            displayName,
            email,
            role: UserRole.Student,
            passwordHash: "",
        }).SetPassword(password);
        const newUser = await this.userRepository.createUser(uEntity);
        return { email: newUser.email };
    }

    async validateUser(email: string, password: string) {
        const user = await this.userRepository.findUser(email);
        if (!user) {
            throw new Error("User does not exists");
        }
        const uEntity = new UserEntity(user);
        const isCorrectPassword = await uEntity.ValidatePassword(password);
        if (!isCorrectPassword) {
            throw new Error("User does not exists");
        }
        return { id: user.id };
    }

    async login(id: string, email: string) {
        return {
            access_token: await this.jwtService.signAsync({ id, email }),
        };
    }
}
