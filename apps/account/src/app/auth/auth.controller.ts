import { Body, Controller, HttpException, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

export class RegisterDto {
    email: string;
    displayName?: string;
    password: string;
}

export class LoginDto {
    email: string;
    password: string;
}

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post("login")
    async login(@Body() { email, password }: RegisterDto) {
        const { id } = await this.authService.validateUser(email, password);
        if (!id) {
            throw new HttpException("User does not exists", 404);
        }
        return this.authService.login(id, email);
    }
}
