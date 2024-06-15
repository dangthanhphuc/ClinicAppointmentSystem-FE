import { NotificationType } from "../enums/notification.type";


export interface NotificationResponse {
    id : number;
    title : string;
    message :string;
    date_time : Date;
    read : boolean;
    type: NotificationType;
    user_id : number;
}