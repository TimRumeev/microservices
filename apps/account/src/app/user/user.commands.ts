import { Body, Controller } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { RMQRoute, RMQValidate } from "nestjs-rmq";
import { AccountChangeProfile } from "@courses/contracts";
import { UserEntity } from "./entities/user.entity";

@Controller()
export class UserCommands {
    constructor(private readonly userRepository: UserRepository) {}

    @RMQValidate()
    @RMQRoute(AccountChangeProfile.topic)
    async changeProfile(
        @Body() { user, id }: AccountChangeProfile.Request,
    ): Promise<AccountChangeProfile.Response> {
        const existedUser = await this.userRepository.findUserById(id);
        if (!existedUser) {
            throw new Error("User does not exists");
        }
        const userEntity = new UserEntity(existedUser);
        userEntity.UpdateProfile(user.displayName);
        await this.userRepository.updateUser(userEntity);
        return {};
    }
}
