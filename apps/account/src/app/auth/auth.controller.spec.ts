import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import { RMQModule, RMQService, RMQTestService } from "nestjs-rmq";
import { UserModule } from "../user/user.module";
import { AuthModule } from "./auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { getMongoConfig } from "../configs/mongo.config";
import { INestApplication } from "@nestjs/common";
import { UserRepository } from "../user/repositories/user.repository";
import { AccountLogin, AccountRegister } from "@courses/contracts";

const authLogin: AccountLogin.Request = {
    email: "a11@a.ru",
    password: "1",
};
const authRegister: AccountRegister.Request = {
    ...authLogin,
    displayName: "sigma",
};

describe("AuthController", () => {
    let app: INestApplication;
    let userRepositoy: UserRepository;
    let rmqService: RMQTestService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true, envFilePath: "envs/.account.env" }),
                RMQModule.forTest({}),
                UserModule,
                AuthModule,
                MongooseModule.forRootAsync(getMongoConfig()),
            ],
        }).compile();
        app = module.createNestApplication();
        userRepositoy = app.get<UserRepository>(UserRepository);
        rmqService = app.get(RMQService);
        await app.init();
    });

    it("Register", async () => {
        const res = await rmqService.triggerRoute<
            AccountRegister.Request,
            AccountRegister.Response
        >(AccountRegister.topic, authRegister);
        expect(res.email).toEqual(authRegister.email);
    });

    it("Register", async () => {
        const res = await rmqService.triggerRoute<AccountLogin.Request, AccountLogin.Response>(
            AccountLogin.topic,
            authLogin,
        );
        expect(res.access_token).toBeDefined();
    });

    afterAll(async () => {
        await userRepositoy.deleteUser(authRegister.email);
        app.close();
    });
});
