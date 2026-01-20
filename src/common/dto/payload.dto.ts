import { IsNotEmpty, IsPositive, IsString } from "class-validator";

export class PayloadDto {

    @IsPositive()
    @IsNotEmpty()
    sub!: number;

    @IsString()
    @IsNotEmpty()
    userName!: string;
}