import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResponseObject } from "../responses/api.response";

@Injectable({
    providedIn: 'root'
})
export class SpecialtyService {
    private readonly apiBaseUrl : string = `${environment.apiBaseUrl}/specialties`;

    constructor(
        private http : HttpClient
    ) {}

    getSpecialties() : Observable<ResponseObject> {
        return this.http.get<ResponseObject>(`${this.apiBaseUrl}`);
    }
}