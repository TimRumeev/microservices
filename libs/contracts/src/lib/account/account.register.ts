export namespace AccountRegister {
    export const topic = "account.register.command";

    export class Request {
        email: string;
        displayName?: string;
        password: string;
    }

    export class Response {
        email: string;
    }
}
