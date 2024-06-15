export interface AppointmentTimesResponse {
    doctor_id : number;
    appointment_id: number;
    patient_id: number;
    available_time_start : any | Date;
    available_time_end : any | Date;
}