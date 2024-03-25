import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { getJwtConfig } from "../configs/jwt.config";

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [UserModule, JwtModule.registerAsync(getJwtConfig()), UserModule],
})
export class AuthModule {}
