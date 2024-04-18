import { HttpStatusCode } from "@angular/common/http";

export interface ResponseObject {
    timeStamp : Date;
    statusCode : string;
    status : HttpStatusCode;
    reason : string;
    message : string;
    developerMessage : string;
    data : any;
}