export interface Appointment {
    id : number ;
    availableTimeStart : Date;
    availableTimeEnd : Date ;
    status : string; 
    roomId : number ;
    appointmentTypeId : number ;
    doctorId : number ;
    patientId : number ;
}