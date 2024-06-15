import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseObject } from '../responses/api.response';
import { RoomDTO } from '../dtos/room/room.dto';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private readonly apiBaseUrl : string = environment.apiBaseUrl + '/rooms';

  constructor(private http : HttpClient) { }

  getRoom(id : number) : Observable<ResponseObject>{
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}/${id}`);
  }

  getRooms() : Observable<ResponseObject>{
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}`);
  }

  getRoomsByClinicId(clinicId : number) : Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}/clinics/${clinicId}`);
  }

  createRoom(roomDTO : RoomDTO) : Observable<ResponseObject> {
    return this.http.post<ResponseObject>(`${this.apiBaseUrl}`, roomDTO);
  }

  updateRoom(id : number, roomDTO : RoomDTO) : Observable<ResponseObject> {
    return this.http.put<ResponseObject>(`${this.apiBaseUrl}/update/${id}`, roomDTO);
  }

  deleteRoom(id : number) : Observable<ResponseObject> {
    return this.http.delete<ResponseObject>(`${this.apiBaseUrl}/delete/${id}`);
  }
  
}
