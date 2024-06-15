import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ResponseObject } from '../responses/api.response';
import { Observable } from 'rxjs';
import { DoctorDTO } from '../dtos/doctor/doctor.dto';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  
  private readonly apiBaseUrl : string = environment.apiBaseUrl + '/doctors';

  constructor(private http : HttpClient) { }

  getDoctors () : Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}`);
  }

  getDoctor (id : number ) : Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}/${id}`);
  }

  createDoctor(doctorDTO : DoctorDTO) : Observable<ResponseObject>  {
    return this.http.post<ResponseObject>(`${this.apiBaseUrl}`, doctorDTO);
  }

  updateDoctor(id : number, doctorDTO : DoctorDTO) : Observable<ResponseObject>{
    return this.http.put<ResponseObject>(`${this.apiBaseUrl}/update/${id}`, doctorDTO);
  } 

  deleteDoctor(id : number) : Observable<ResponseObject>{
    return this.http.delete<ResponseObject>(`${this.apiBaseUrl}/delete/${id}`);
  }


}
