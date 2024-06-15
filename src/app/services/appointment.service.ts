import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppointmentDTO } from '../dtos/appointment/appointment.dto';
import { ResponseObject } from '../responses/api.response';
import { Observable } from 'rxjs';
import { BookingDTO } from '../dtos/appointment/booking.dto';
import { UpdateResultDTO } from '../dtos/appointment/update.result.dto';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly apiBaseUrl : string = environment.apiBaseUrl + '/appointments';

  constructor(private http : HttpClient) { }
  
  create(appointmentTypeDTO : AppointmentDTO) : Observable<ResponseObject> {
    return this.http.post<ResponseObject>(`${this.apiBaseUrl}/create`, appointmentTypeDTO);
  }

  update(id : number, appointmentTypeDTO : AppointmentDTO) : Observable<ResponseObject>{
    return this.http.put<ResponseObject>(`${this.apiBaseUrl}/update/${id}`, appointmentTypeDTO);
  }

  delete(id : number) : Observable<ResponseObject> {
    return this.http.delete<ResponseObject>(`${this.apiBaseUrl}/delete/${id}`);
  }

  getAppointment(id : number) : Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}/${id}`);
  }
  
  getAppointmentTimes(doctorId : number) : Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}/appointment_times/doctors/${doctorId}`);
  }

  getAppointments() : Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}`);
  }
  
  getAppointmentsByPatientId(patientId: number): Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}/patients/${patientId}`);
  }

  getAppointmentsByDoctorId(doctorId: number): Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}/doctors/${doctorId}`);
  }

  bookingAppointment(bookingDTO : BookingDTO): Observable<ResponseObject> {
    return this.http.put<ResponseObject>(`${this.apiBaseUrl}/patients/booking`, bookingDTO);
  }

  cancellationOfBooking (appointmentId : number) : Observable<ResponseObject>{
    return this.http.delete<ResponseObject>(`${this.apiBaseUrl}/patient/cancellation/${appointmentId}`);
  }

  updateResult(updateResultDTO : UpdateResultDTO) : Observable<ResponseObject> {
    const formData =  new FormData();
    for (let i = 0; i < updateResultDTO.files.length; i++) {
      formData.append('files', updateResultDTO.files[i]);
    }
    formData.append("appointmentId", updateResultDTO.appointment_id.toString());
    formData.append("clinicalDiagnosis", updateResultDTO.clinical_diagnosis);
    formData.append("result", updateResultDTO.result);

    return this.http.post<ResponseObject>(`${this.apiBaseUrl}/upload_result`, formData);
  }

  getUpdateResultByAppointmentId(id : number) {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}/update_result/${id}`);
  }

}
