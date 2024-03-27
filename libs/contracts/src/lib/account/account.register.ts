import { IsEmail, IsOptional, IsString } from "class-validator";

export namespace AccountRegister {
    export const topic = "account.register.command";

    export class Request {
        @IsEmail()
        email: string;

        @IsOptional()
        @IsString()
        displayName?: string;

        @IsString()
        password: string;
    }

    export class Response {
        email: string;
    }
}
