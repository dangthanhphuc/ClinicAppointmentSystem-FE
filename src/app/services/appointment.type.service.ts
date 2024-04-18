import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseObject } from '../responses/api.response';
import { AppointmentTypeDTO } from '../dtos/appointment-type/appointment.type.dto';

@Injectable({
  providedIn: 'root'
})
export class AppointmentTypeService {

  private readonly apiBaseUrl : string = environment.apiBaseUrl + '/appointment_types';

  constructor(private http : HttpClient) { }

  create(appointmentTypeDTO : AppointmentTypeDTO) : Observable<ResponseObject> {
    return this.http.post<ResponseObject>(`${this.apiBaseUrl}/create`, appointmentTypeDTO);
  }

  update(id : number, appointmentTypeDTO : AppointmentTypeDTO) : Observable<ResponseObject>{
    return this.http.put<ResponseObject>(`${this.apiBaseUrl}/update/${id}`, appointmentTypeDTO);
  }

  delete(id : number) : Observable<ResponseObject> {
    return this.http.delete<ResponseObject>(`${this.apiBaseUrl}/delete/${id}`);
  }

  getAppointmentType(id : number) : Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}/${id}`);
  }

  getAppointmentTypes() : Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}`);
  }
  
}
