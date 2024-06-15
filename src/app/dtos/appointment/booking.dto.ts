export class BookingDTO {
    patient_id : number;
    appointment_id : number;
    appointment_type_id : number;
    note : string;

    constructor(data : any){
        this.patient_id = data.patient_id;
        this.appointment_id = data.appointment_id;
        this.appointment_type_id = data.appointment_type_id;
        this.note = data.note;
    }
}