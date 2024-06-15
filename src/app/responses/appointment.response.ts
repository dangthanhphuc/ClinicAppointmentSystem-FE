import { AppointmentStatus } from "../enums/appointment.status";
import { DoctorResponse } from "./doctor.response";
import { PatientResponse } from "./patient.response";
import { ResultImageResponse } from "./result.image.response";

export interface AppointmentResponse {
    id: number;
    available_time_start : Date;
    available_time_end : Date;
    status : AppointmentStatus;
    appointment_type_name : string; // optional
    doctor : DoctorResponse;
    patient : PatientResponse; // optional
    note : string;
    clinical_diagnosis : string;
    result : string;
    result_images?: ResultImageResponse[];

}