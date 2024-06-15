import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ResponseObject } from '../responses/api.response';
import { Observable } from 'rxjs';
import { PatientDTO } from '../dtos/patient/patient.dto';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private readonly apiBaseUrl : string = environment.apiBaseUrl + '/patients';

  constructor(private http : HttpClient) { }

  getPatients () : Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}`);
  }

  getPatient (id : number ) : Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}/${id}`);
  }

  createPatient(patientDTO : PatientDTO) : Observable<ResponseObject>  {
    return this.http.post<ResponseObject>(`${this.apiBaseUrl}`, patientDTO);
  }

  updatePatient(id : number, patientDTO : PatientDTO) : Observable<ResponseObject>{
    return this.http.put<ResponseObject>(`${this.apiBaseUrl}/update/${id}`, patientDTO);
  } 

  deletePatient(id : number) : Observable<ResponseObject>{
    return this.http.delete<ResponseObject>(`${this.apiBaseUrl}/delete/${id}`);
  }

}
