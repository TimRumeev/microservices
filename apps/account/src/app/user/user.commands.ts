import { Body, Controller } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { RMQRoute, RMQService, RMQValidate } from "nestjs-rmq";
import { AccountBuyCourse, AccountChangeProfile, AccountCheckPayment } from "@courses/contracts";
import { UserService } from "./user.service";

@Controller()
export class UserCommands {
    constructor(
        private readonly userRepository: UserRepository,
        private rmqService: RMQService,
        private readonly userService: UserService,
    ) {}

    @RMQValidate()
    @RMQRoute(AccountChangeProfile.topic)
    async changeProfile(
        @Body() { user, id }: AccountChangeProfile.Request,
    ): Promise<AccountChangeProfile.Response> {
        return this.userService.changeProfile(user, id);
    }

    @RMQValidate()
    @RMQRoute(AccountBuyCourse.topic)
    async buyCourse(
        @Body() { userId, courseId }: AccountBuyCourse.Request,
    ): Promise<AccountBuyCourse.Response> {
        return this.userService.buyCourse(userId, courseId);
    }

    @RMQValidate()
    @RMQRoute(AccountCheckPayment.topic)
    async checkPayment(
        @Body() { userId, courseId }: AccountCheckPayment.Request,
    ): Promise<AccountCheckPayment.Response> {
        return this.userService.checkPayment(userId, courseId);
    }
}
