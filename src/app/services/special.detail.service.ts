import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResponseObject } from "../responses/api.response";

@Injectable({
    providedIn: 'root'
})
export class SpecialtyDetailService {
    private readonly apiBaseUrl : string = `${environment.apiBaseUrl}/specialty_details`;

    constructor(private http : HttpClient) {}

    getBySpecialtyId(specialtyId : number) : Observable<ResponseObject> {
        return this.http.get<ResponseObject>(`${this.apiBaseUrl}/specialty/${specialtyId}`); 
    }
}