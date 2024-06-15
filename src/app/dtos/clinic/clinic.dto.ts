import { IsAlphanumeric, IsEmail, IsNotEmpty, IsPhoneNumber } from "class-validator";

export class ClinicDTO {

    @IsNotEmpty()
    name : string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    address: string;

    @IsPhoneNumber()
    phoneNumber: string;

    
    description: string;

    @IsAlphanumeric()
    categoryId:number;

    constructor(data : any){
        this.name = data.name;
        this.email = data.email;
        this.address = data.address;
        this.phoneNumber = data.phoneNumber;
        this.description = data.description;
        this.categoryId = data.categoryId;
    }
}