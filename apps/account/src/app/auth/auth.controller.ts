import { Body, Controller, HttpException, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AccountLogin, AccountRegister } from "@courses/contracts";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    async register(@Body() dto: AccountRegister.Request): Promise<AccountRegister.Response> {
        return this.authService.register(dto);
    }

    @Post("login")
    async login(@Body() { email, password }: AccountLogin.Request): Promise<AccountLogin.Response> {
        const { id } = await this.authService.validateUser(email, password);
        if (!id) {
            throw new HttpException("User does not exists", 404);
        }
        return this.authService.login(id, email);
    }
}
