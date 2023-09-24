import { OmitType } from "@nestjs/mapped-types";
import { userEntity } from "../entities/auth.entity";

export class CreateAuthDto extends OmitType(userEntity,[]){
    username: string;
    password: string;
    isActive: number;
}
