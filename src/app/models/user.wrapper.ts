import { UserType } from "../enums/user.type";
import { DoctorResponse } from "../responses/doctor.response";
import { UserResponse } from "../responses/user.response";
import { Clinic } from "./clinic";
import { Specialty } from "./specialty";

export class UserWrapper<T extends UserResponse> {
    constructor(private user: T) {}
  
    getUser(): T {
      return this.user;
    }
  
    getRole(): string {
      return this.user.role;
    }
  
    getSpecialty(): Specialty[] | null {
      if (this.user.user_type === UserType.DOCTOR) {
        return (this.user as unknown as DoctorResponse).specialties;
      }
      return null;
    }
  
    getClinic() : Clinic | null{
        if (this.user.user_type === UserType.DOCTOR) {
            return (this.user as unknown as DoctorResponse).clinic;
        }
        return null;
    }
  }