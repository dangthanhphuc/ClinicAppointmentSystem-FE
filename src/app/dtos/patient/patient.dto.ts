import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsPhoneNumber } from "class-validator";

export class PatientDTO {

    @IsEmail()
    email : string;
    
    @IsNotEmpty()
    name : string;
    
    @IsNotEmpty()
    address : string;

    @IsPhoneNumber()
    phone_number : string;

    @IsDate()
    date_of_birth : Date;

    @IsBoolean()
    gender : boolean;

    constructor(data : any) {
        this.email = data.email;
        this.name = data.name;
        this.address = data.address;
        this.phone_number = data.phone_number;
        this.date_of_birth = data.date_of_birth;
        this.gender = data.gender;
    }

}