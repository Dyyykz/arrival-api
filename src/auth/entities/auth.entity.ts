import { user as userModel } from "@prisma/client";

export class userEntity implements userModel {
    id: string;
    username: string;
    password: string;
    isActive: number;
}
