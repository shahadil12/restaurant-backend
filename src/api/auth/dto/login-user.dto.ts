import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDTO {
    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsNotEmpty()
    password: string;
}
