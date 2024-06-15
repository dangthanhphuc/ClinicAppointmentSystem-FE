import { Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseObject } from '../responses/api.response';
import { LoginDTO } from '../dtos/user/login.dto';
import { HttpUtilService } from '../utils/http.util.service';
import { RegisterPatient } from '../dtos/user/register.patient.dto';
import { RegisterDoctor } from '../dtos/user/register.doctor.dto';
import { UserResponse } from './../responses/user.response';
import { DOCUMENT } from '@angular/common';
import { UserWrapper } from '../models/user.wrapper';
import { UserType } from '../enums/user.type';
import { DoctorResponse } from '../responses/doctor.response';
import { PatientResponse } from '../responses/patient.response';
import { User } from './../models/user';
import { error } from 'node:console';
import { UpdatePassDTO } from '../dtos/user/update.pass.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiBaseUrl : string = environment.apiBaseUrl + '/users';

  localStorage?: Storage;

  private readonly apiConfig = {
    headers : this.httpUtilService.createHeaders()
  }

  constructor(
    private http : HttpClient,
    private httpUtilService : HttpUtilService,
    @Inject(DOCUMENT) private document : Document
  ) { 
    this.localStorage = this.document.defaultView?.localStorage;
  }

  getUser(id : number) : Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}/${id}`);
  }

  getUsers(): Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}`);
  }

  getUserDetails() : Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}/details`);
  }

  blockOrEnable(id : number) : Observable<ResponseObject>{
    return this.http.delete<ResponseObject>(`${this.apiBaseUrl}/delete/${id}`);
  }

  registerPatient (registerPatient: RegisterPatient) : Observable<ResponseObject> {
    return this.http.post<ResponseObject>(`${this.apiBaseUrl}/register/patient`, registerPatient, this.apiConfig);
  }

  registerDoctor (registerDoctor: RegisterDoctor) : Observable<ResponseObject> {
    return this.http.post<ResponseObject>(`${this.apiBaseUrl}/register/doctor`, registerDoctor, this.apiConfig);
  }

  updateProfileImage(id : number, file : File) : Observable<ResponseObject> {
    const formData = new FormData(); // FormDate đại diện cho cách truyền dự liệu bằng ModelAttribute
    formData.append("file", file);
    
    return this.http.post<ResponseObject>(`${this.apiBaseUrl}/update-profile-image/${id}`, formData);
  }

  login(loginDTO : LoginDTO) : Observable<ResponseObject>{
    return this.http.post<ResponseObject>(`${this.apiBaseUrl}/login`, loginDTO, this.apiConfig);
  }

  resetPassword(id : number, updatePassDTO : UpdatePassDTO) : Observable<ResponseObject> {
    return this.http.put<ResponseObject>(`${this.apiBaseUrl}/resetPass/${id}`, updatePassDTO);
  }
  
  saveValueToLocalStorage(key: string, value: any) : void {
    try {
      const valueJSON = JSON.stringify(value);
      this.localStorage?.setItem(key, valueJSON);
    }catch(errors : any){
      console.error(errors);
    }
  }

  saveToLocalStorage(userResponse?: UserResponse) : void {
    try {
      if(userResponse == null || !userResponse){
        return;
      }
      const userResponseJSON = JSON.stringify(userResponse);
      this.localStorage?.setItem("user_details", userResponseJSON);
    }catch (errors : any) {
      console.error(errors);
    }
    
  }

  createUserWrapper(userResponse : UserResponse) : UserWrapper<UserResponse> {
    switch (userResponse.user_type) {
      case UserType.DOCTOR:
        return new UserWrapper<DoctorResponse>(userResponse as DoctorResponse);
      case UserType.PATIENT:
        return new UserWrapper<PatientResponse>(userResponse as PatientResponse);
      default:
        return new UserWrapper<UserResponse>(userResponse);
    }
  }

  getValueFromLocalStorage(key : string) : any | null {
    try {
      const valueJson = this.localStorage?.getItem(key);

      if(valueJson == null || valueJson == undefined){
        return null;
      } 

      // Parse userResponseJSON to object
      const value = JSON.parse(valueJson);
      return value;


    } catch (errors : any){
      console.error('Error retrieving user response from local storage:' + errors);
      return null;
    }
  }

  getFromLocalStorage() : UserResponse | null {
    try {
      // Get the user details from local storage
      const userResponseJSON = this.localStorage?.getItem("user_details");
      
      if(userResponseJSON == null || userResponseJSON == undefined){
        return null;
      } 

      // Parse userResponseJSON to object
      const userResponse = JSON.parse(userResponseJSON);
      return userResponse;
    }
    catch (errors : any) {
      console.error('Error retrieving user response from local storage:' + errors);
      return null;
    }
  
  }

  removeFromLocalStorage () : void{
    try {
      this.localStorage?.removeItem("user_details");
    }
    catch (errors : any) {
      console.error('Error removing user data from local storage: ' + errors);
    }
    
  }

  removeValueFromLocalStorage (key : string) : void{
    try {
      this.localStorage?.removeItem(key);
    }
    catch (errors : any) {
      console.error('Error removing user data from local storage: ' + errors);
    }
  }

  clearFormLocalStorage () : void {
    try {
      this.localStorage?.clear();
    }
    catch (errors : any) {
      console.error('Error removing user data from local storage: ' + errors);
    }
  }


  
}
