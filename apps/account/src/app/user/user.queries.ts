import { AccountUserCourses, AccountUserInfo } from "@courses/contracts";
import { Body, Controller } from "@nestjs/common";
import { RMQRoute, RMQValidate } from "nestjs-rmq";
import { UserRepository } from "./repositories/user.repository";
import { UserEntity } from "./entities/user.entity";

@Controller()
export class UserQueries {
    constructor(private readonly userRepository: UserRepository) {}

    @RMQValidate()
    @RMQRoute(AccountUserInfo.topic)
    async userInfo(@Body() { id }: AccountUserInfo.Request): Promise<AccountUserInfo.Response> {
        const user = await this.userRepository.findUserById(id);
        const profile = new UserEntity(user).getPuiblicProfile();
        return {
            profile,
        };
    }

    @RMQValidate()
    @RMQRoute(AccountUserCourses.topic)
    async userCourses(
        @Body() { id }: AccountUserCourses.Request,
    ): Promise<AccountUserCourses.Response> {
        const user = await this.userRepository.findUserById(id);
        return {
            courses: user.courses,
        };
    }
}
