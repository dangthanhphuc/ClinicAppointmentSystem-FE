import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsPhoneNumber } from "class-validator";

export class PatientDTO {
    @IsEmail()
    email : string;
    
    @IsNotEmpty()
    name : string;
    
    @IsNotEmpty()
    address : string;

    @IsPhoneNumber()
    phoneNumber : string;

    @IsDate()
    dateOfBirth : Date;

    @IsBoolean()
    gender : boolean;

    constructor(data : any) {
        this.email = data.email;
        this.name = data.name;
        this.address = data.address;
        this.phoneNumber = data.phoneNumber;
        this.dateOfBirth = data.dateOfBirth;
        this.gender = data.gender;
    }

}