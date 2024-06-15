import { UserStatus } from "../enums/user.status";
import { UserType } from "../enums/user.type";

export interface UserResponse {
    id: number;
    img_url : string;
    email : string;
    name : string;
    address : string;
    phone_number : string;
    date_of_birth : Date;
    gender : string;
    user_type : UserType;
    user_status : UserStatus;
    role: string;
}