import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ResponseObject } from '../responses/api.response';
import { ClinicDTO } from '../dtos/clinic/clinic.dto';


@Injectable({
  providedIn: 'root'
})
export class ClinicService {

  private readonly apiBaseUrl : string = environment.apiBaseUrl + '/clinics';

  constructor(private http : HttpClient) { }
  
  getClinics () : Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}`);
  }

  getClinic (id : number ) : Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}/${id}`);
  }

  createClinic(clinicDTO : ClinicDTO) : Observable<ResponseObject>  {
    return this.http.post<ResponseObject>(`${this.apiBaseUrl}`, clinicDTO);
  }

  updateClinic(id : number, clinicDTO : ClinicDTO) : Observable<ResponseObject>{
    return this.http.put<ResponseObject>(`${this.apiBaseUrl}/update/${id}`, clinicDTO);
  } 

  deleteClinic(id : number) : Observable<ResponseObject>{
    return this.http.delete<ResponseObject>(`${this.apiBaseUrl}/delete/${id}`);
  }

  getClinicsByKeyword(
    keyword :string,
    page : number,
    limit : number
  ) : Observable<ResponseObject>{
    const param = {
      keyword: keyword,
      page: page.toString(),
      limit: limit.toString()
    }
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}/search`, {params: param});
  }
  
}
