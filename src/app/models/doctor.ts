import { Specialty } from "./specialty";
import { SpecialtyDetail } from "./specialty.detail";

export interface Doctor {
    id : number;
    imgUrl : string;
    email : string;
    name : string;
    address : string;
    phoneNumber : string;
    dateOfBirth : string;
    gender : string;
    userId : number;
    clinicId : number;
    specialties : SpecialtyDetail[];
}