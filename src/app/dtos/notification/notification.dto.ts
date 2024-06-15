import { NotificationType } from "../../enums/notification.type";

export class NotificationDTO {
    user_id : number;
    title : string;
    message : string;
    type: NotificationType;

    constructor(data : any) {
        this.user_id = data.user_id;
        this.title = data.title;
        this.message = data.message;
        this.type = data.type;
    }
}