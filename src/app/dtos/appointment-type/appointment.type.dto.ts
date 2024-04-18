import { IsNotEmpty } from "class-validator";

export class AppointmentTypeDTO {
    @IsNotEmpty()
    name: string;
    
    description: string;

    constructor(data : any){
        this.name = data.name;
        this.description = data.description;
    }
}