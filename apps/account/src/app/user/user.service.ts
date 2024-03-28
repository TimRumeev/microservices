//CORE SERVICE
import { Injectable } from "@nestjs/common";
import { UserEntity } from "./entities/user.entity";
import { IUser } from "@courses/interfaces";
import { RMQService } from "nestjs-rmq";
import { UserRepository } from "./repositories/user.repository";
import { BuyCourseSaga } from "./sagas/buy-course.saga";
import { UserEventEmitter } from "./user.event-emitter";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly rmqService: RMQService,
        private readonly userEventEmitter: UserEventEmitter,
    ) {}

    public async changeProfile(user: Pick<IUser, "displayName">, id: string) {
        const existedUser = await this.userRepository.findUserById(id);
        if (!existedUser) {
            throw new Error("User does not exists");
        }
        const userEntity = new UserEntity(existedUser);
        userEntity.UpdateProfile(user.displayName);
        await this.updateUser(userEntity);
        return {};
    }

    public async buyCourse(userId: string, courseId: string) {
        const existedUser = await this.userRepository.findUserById(userId);
        if (!existedUser) {
            throw new Error("Такого пользователя нет");
        }
        const userEntity = new UserEntity(existedUser);
        const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
        const { user, paymentLink } = await saga.getState().pay();
        await this.updateUser(user);

        return { paymentLink };
    }

    public async checkPayment(userId: string, courseId: string) {
        const existedUser = await this.userRepository.findUserById(userId);
        if (!existedUser) {
            throw new Error("Такого пользователя нет");
        }
        const userEntity = new UserEntity(existedUser);
        const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
        const { user, status } = await saga.getState().checkPayment();
        await this.updateUser(user);
        return { status };
    }

    private async updateUser(user: UserEntity) {
        return Promise.all([
            this.userRepository.updateUser(user),
            this.userEventEmitter.handle(user),
        ]);
    }
}
