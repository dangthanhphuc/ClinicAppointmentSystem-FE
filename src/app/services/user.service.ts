import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseObject } from '../responses/api.response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiBaseUrl : string = environment.apiBaseUrl + '/users';

  constructor(private http : HttpClient) { }

  getUser(id : number) : Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}/${id}`);
  }

  getUsers(): Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}`);
  }

  blockOrEnable(id : number) : Observable<ResponseObject>{
    return this.http.delete<ResponseObject>(`${this.apiBaseUrl}/delete/${id}`);
  }
  
}
