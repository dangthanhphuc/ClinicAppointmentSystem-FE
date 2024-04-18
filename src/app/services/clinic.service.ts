import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ResponseObject } from '../responses/api.response';
import { PatientDTO } from '../dtos/patient/patient.dto';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {

  private readonly apiBaseUrl : string = environment.apiBaseUrl + '/clinics';

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

  uploadImages(id : number, files : File[]) : Observable<ResponseObject> {
    const formData = new FormData(); // FormDate đại diện cho cách truyền dự liệu bằng ModelAttribute
    debugger;
    for(let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    return this.http.post<ResponseObject>(`${this.apiBaseUrl}/uploads/${id}`, formData);
  }
}
