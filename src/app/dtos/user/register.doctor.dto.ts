import { IsAlphanumeric, IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber } from "class-validator";

export class RegisterDoctor {

    @IsEmail()
    email : string;
    @IsNotEmpty()
    name : string;
    address : string;
    @IsPhoneNumber()
    phone_number : string;
    @IsNotEmpty()
    date_of_birth : Date;
    @IsNotEmpty()
    gender : boolean;
    @IsNotEmpty()
    username : string;
    @IsNotEmpty()
    password : string;
    @IsNotEmpty()
    retype_password : string;
    @IsNumber()
    clinic_id : number ;

    constructor(data : any) {
        this.email = data.email;
        this.name = data.name;
        this.address = data.address;
        this.phone_number = data.phone_number;
        this.date_of_birth = data.date_of_birth;
        this.gender = data.gender;
        this.username = data.username
        this.password = data.password
        this.retype_password = data.retype_password;
        this.clinic_id = data.clinic_id;
    }

}