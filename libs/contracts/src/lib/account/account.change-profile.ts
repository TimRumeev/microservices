import { IsString } from "class-validator";
import { IUser } from "@courses/interfaces";

export namespace AccountChangeProfile {
    export const topic = "account.change-profile.command";

    export class Request {
        @IsString()
        id: string;

        @IsString()
        displayName: Pick<IUser, "displayName">;
    }

    export class Response {}
}
