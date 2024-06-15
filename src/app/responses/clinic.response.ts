import { CategoryResponse } from "./category.response";

export interface ClinicResponse {
    id : number;
    name : string;
    email : string;
    address : string;
    phone_number : string;
    description : string;
    category : CategoryResponse;
}