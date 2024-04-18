import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private readonly apiBaseUrl : string = environment.apiBaseUrl + '/patients';

  constructor(private http : HttpClient) { }
}
