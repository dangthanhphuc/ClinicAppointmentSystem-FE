import { UserStatus } from "../enums/user.status";
import { UserType } from "../enums/user.type";
import { Clinic } from "../models/clinic";
import { Role } from "../models/role";
import { Specialty } from "../models/specialty";
import { SpecialtyDetail } from "../models/specialty.detail";
import { UserResponse } from "./user.response";

export interface DoctorResponse extends UserResponse{
    clinic : Clinic;
    specialties : Specialty[];
}