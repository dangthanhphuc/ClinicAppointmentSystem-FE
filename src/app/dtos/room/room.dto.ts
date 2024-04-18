import { IsAlphanumeric, IsNotEmpty } from "class-validator";

export class RoomDTO {
    @IsNotEmpty()
    name : string;
    
    @IsAlphanumeric()
    clinicId : number;

    constructor(data : any) {
        this.name = data.name;
        this.clinicId = data.clinicId;
    }
}