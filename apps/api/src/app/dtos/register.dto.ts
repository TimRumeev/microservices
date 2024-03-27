import { IsEmail, IsOptional, IsString } from "class-validator";

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    displayName?: string;

    @IsString()
    password: string;
}
