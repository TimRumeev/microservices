import {
    CourseGetCourse,
    PaymentCheck,
    PaymentGenerateLink,
    PaymentStatus,
} from "@courses/contracts";
import { UserEntity } from "../entities/user.entity";
import { BuyCourseSagaState } from "./buy-course.state";
import { PurchaseState } from "@courses/interfaces";

export class BuyCourseSagaStateStarted extends BuyCourseSagaState {
    public async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
        const { course } = await this.saga.rmqService.send<
            CourseGetCourse.Request,
            CourseGetCourse.Response
        >(CourseGetCourse.topic, { id: this.saga.courseId });
        if (!course) {
            throw new Error("Такого курса нет");
        }
        if (course.price == 0) {
            this.saga.setState(PurchaseState.Purchased, course._id);
            return { paymentLink: null, user: this.saga.user };
        }
        const { paymentLink } = await this.saga.rmqService.send<
            PaymentGenerateLink.Request,
            PaymentGenerateLink.Response
        >(PaymentGenerateLink.topic, {
            courseId: course._id,
            userId: this.saga.user._id,
            sum: course.price,
        });
        this.saga.setState(PurchaseState.WaitingForPayment, course._id);
        return { paymentLink, user: this.saga.user };
    }
    public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
        throw new Error("Нельзя проверить платёж, который не начался");
    }
    public async cancel(): Promise<{ user: UserEntity }> {
        this.saga.setState(PurchaseState.Canceled, this.saga.courseId);

        return { user: this.saga.user };
    }
}

export class BuyCourseSagaStateProcess extends BuyCourseSagaState {
    public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
        throw new Error("Покупка уже в процессе");
    }
    public async checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
        const { status } = await this.saga.rmqService.send<
            PaymentCheck.Request,
            PaymentCheck.Response
        >(PaymentCheck.topic, { courseId: this.saga.courseId, userId: this.saga.user._id });

        if (status == "canceled") {
            this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
            return { user: this.saga.user, status: "canceled" };
        }
        if (status !== "success") {
            this.saga.setState(PurchaseState.Purchased, this.saga.courseId);
            return { user: this.saga.user, status: "success" };
        }
        this.saga.setState(PurchaseState.Purchased, this.saga.courseId);
        return { user: this.saga.user, status: "process" };
    }
    public cancel(): Promise<{ user: UserEntity }> {
        throw new Error("Нельзя отменить платёж во время его выполнения");
    }
}

export class BuyCourseSagaStatePurchased extends BuyCourseSagaState {
    public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
        throw new Error("Курс уже куплен");
    }
    public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
        throw new Error("Курс уже куплен");
    }
    public cancel(): Promise<{ user: UserEntity }> {
        throw new Error("Нельзя отменить купленный курс");
    }
}

export class BuyCourseSagaStateCanceled extends BuyCourseSagaState {
    public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
        this.saga.setState(PurchaseState.Started, this.saga.courseId);
        return this.saga.getState().pay();
    }
    public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
        throw new Error("Нельзя проверить платёж по отменённому курсу");
    }
    public cancel(): Promise<{ user: UserEntity }> {
        throw new Error("Нельзя отменить отменённый курс");
    }
}
