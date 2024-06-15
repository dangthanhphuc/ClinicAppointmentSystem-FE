import { Category } from "./category";

export interface Clinic {
    id : number;
    name : string;
    email : string;
    address : string;
    phoneNumber : string;
    description : string;
    category : Category;
}