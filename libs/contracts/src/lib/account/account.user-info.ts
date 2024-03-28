import { IsString } from "class-validator";
import { IUser } from "@courses/interfaces";

export namespace AccountUserInfo {
    export const topic = "account.user-info.query";

    export class Request {
        @IsString()
        id: string;
    }

    export class Response {
        profile: Omit<IUser, "passwordHash">;
    }
}
