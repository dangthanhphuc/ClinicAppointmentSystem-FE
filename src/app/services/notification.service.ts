import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ResponseObject } from "../responses/api.response";
import { BehaviorSubject, Observable } from "rxjs";
import { NotificationDTO } from "../dtos/notification/notification.dto";
import { NotificationResponse } from "../responses/notification.response";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private notificationSubject = new BehaviorSubject<NotificationResponse | null>(null);
    notification$ = this.notificationSubject.asObservable();

    private readonly apiBaseUrl = environment.apiBaseUrl + '/notifications';


    constructor(private http : HttpClient){}

    getAllByUserId(userId : number) : Observable<ResponseObject>{
        return this.http.get<ResponseObject>(`${this.apiBaseUrl}/${userId}`);
    }

    creates(notificationDTOs : NotificationDTO[]) : Observable<ResponseObject> {
        return this.http.post<ResponseObject>(`${this.apiBaseUrl}`, notificationDTOs);
    }

    haveRead(id : number) : Observable<ResponseObject> {
        return this.http.get<ResponseObject>(`${this.apiBaseUrl}/read/${id}`);
    }

    readAll(id : number) : Observable<ResponseObject> {
        return this.http.get<ResponseObject>(`${this.apiBaseUrl}/read_all/${id}`);
    }

    sendMessage(notificationResponse : NotificationResponse) {
        this.notificationSubject.next(notificationResponse);
    }

}