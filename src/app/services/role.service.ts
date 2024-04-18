import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ResponseObject } from '../responses/api.response';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private readonly apiBaseUrl : string = environment.apiBaseUrl + '/roles';

  constructor(private http : HttpClient) { }
  
  getRoles() : Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}`);
  }
}
