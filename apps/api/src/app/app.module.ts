import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { ConfigModule } from "@nestjs/config";
import { RMQModule } from "nestjs-rmq";
import { getRmqConfig } from "./configs/rmq.config";
import { JwtModule } from "@nestjs/jwt";
import { getJwtConfig } from "./configs/jwt.config";
import { PassportModule } from "@nestjs/passport";
import { UserConroller } from "./controllers/user.controller";

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: "envs/.api.env", isGlobal: true }),
        RMQModule.forRootAsync(getRmqConfig()),
        JwtModule.registerAsync(getJwtConfig()),
        PassportModule,
    ],
    controllers: [AuthController, UserConroller],
})
export class AppModule {}
