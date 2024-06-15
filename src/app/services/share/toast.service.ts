import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ToastState } from "../../enums/toast.state";

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    
    private toastMessSubject = new BehaviorSubject<ToastSend | null>(null);
    toastMess$ = this.toastMessSubject.asObservable();

    sendToastMess(state : ToastState, title : string, message : string) {
        this.toastMessSubject.next({ state ,title, message});
    }

}

export interface ToastSend {
    state : ToastState;
    title: string;
    message: string;
}