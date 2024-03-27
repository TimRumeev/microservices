import { Body, Controller, HttpException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AccountLogin, AccountRegister } from "@courses/contracts";
import { RMQRoute, RMQValidate } from "nestjs-rmq";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @RMQValidate()
    @RMQRoute(AccountRegister.topic)
    async register(@Body() dto: AccountRegister.Request): Promise<AccountRegister.Response> {
        return this.authService.register(dto);
    }

    @RMQValidate()
    @RMQRoute(AccountLogin.topic)
    async login(@Body() { email, password }: AccountLogin.Request): Promise<AccountLogin.Response> {
        const { id } = await this.authService.validateUser(email, password);
        if (!id) {
            throw new HttpException("User does not exists", 404);
        }
        return this.authService.login(id, email);
    }
}
