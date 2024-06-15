import { IsNotEmpty } from "class-validator";

export class LoginDTO {
    @IsNotEmpty()
    username : string;
    @IsNotEmpty()
    password : string;

    constructor(data : any) {
        this.username = data.username;
        this.password = data.password;
        
    }
}