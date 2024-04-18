import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly apiBaseUrl : string = environment.apiBaseUrl + '/appointments';

  constructor(private http : HttpClient) { }
  
}
