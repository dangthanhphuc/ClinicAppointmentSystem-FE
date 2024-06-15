import { IsDate, IsNotEmpty, ValidateIf } from 'class-validator';


export class AppointmentDTO {

    available_time_start : string;

    available_time_end : string;
    
    @IsNotEmpty()
    doctor_id : number;

    constructor(data : any){
        this.available_time_start = data.availableTimeStart;
        this.available_time_end = data.availableTimeEnd;
        this.doctor_id = data.doctor_id;
        
    }
}