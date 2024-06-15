import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, mergeApplicationConfig } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '../../services/notification.service';
import { NotificationResponse } from '../../responses/notification.response';
import { UserResponse } from '../../responses/user.response';
import { UserService } from '../../services/user.service';
import { ResponseObject } from '../../responses/api.response';
import { NotificationType } from '../../enums/notification.type';


@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit, OnChanges{
  faBell = faBell;
  NotificationType = NotificationType;

  userResponse: UserResponse | null;

  @Input("notifications")
  notifications : NotificationResponse[] = [];
  @Output()
  notificationId = new EventEmitter<number>();
  @Output()
  eventReadAll = new EventEmitter<void>();

  numberOfUnread : number = 0;
  notificationsInDay : NotificationResponse[] = [];
  notificationsInWeek : NotificationResponse[] = [];
  notificationsInMonth : NotificationResponse[] = [];


  constructor(    
    private notificationService : NotificationService,
    private userService : UserService
  ){
    this.userResponse = this.userService.getFromLocalStorage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['notifications'] && changes['notifications'].firstChange == false)
    {
      console.log("changes");
      const previousValue : NotificationResponse[] = changes['notifications'].previousValue;
      const currentValue : NotificationResponse[] = changes['notifications'].currentValue;
      debugger
      const differenceQuantity = currentValue.length - previousValue.length ; 
      if(differenceQuantity > 0){ // Added
        for(let i = currentValue.length - differenceQuantity; i < currentValue.length ; i++) {
          this.notificationClassification(currentValue[i]);
        }
      }

      this.numberOfUnread = this.notifications.filter(notification => !notification.read).length;
    }
  }

  ngOnInit(): void {
    
  }

  calculateDaysDifference(targetDate : Date | string) : string {
    const currentDate = new Date();
    const givenDate = new Date(targetDate);

    // Tính toán sự chênh lệch thời gian bằng milliseconds
    const differenceInTime = currentDate.getTime() - givenDate.getTime();

    // Chênh lệch thời gian bằng giây
    const differenceInSeconds = Math.floor(differenceInTime / 1000);
    // Chênh lệch thời gian bằng phút
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    // Chênh lệch thời gian bằng giờ
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    // Chênh lệch thời gian bằng ngày
    const differenceInDays = Math.floor(differenceInHours / 24);

    if(differenceInSeconds < 60)  {
      return "1 phút trước";
    }else if (differenceInMinutes < 60){
      return `${differenceInMinutes} phút trước`;
    } else if(differenceInHours < 24) {
      return `${differenceInHours} giờ trước`;
    } else if(differenceInDays <= 31) {
      const remainingHours = Math.floor((differenceInTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return `${differenceInDays} ngày ${remainingHours} giờ trước`;
    }

    return `${differenceInDays} ngày trước`;
  }


  notificationClassification(notificationResponse : NotificationResponse) : void {
    const currentDate = new Date();
    const givenDate = new Date(notificationResponse.date_time);

    // Tính toán sự chênh lệch thời gian bằng milliseconds
    const differenceInTime = currentDate.getTime() - givenDate.getTime();

    // Chênh lệch thời gian bằng ngày
    const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

    if(differenceInDays < 1) {
      this.notificationsInDay.push(notificationResponse);
      this.notificationsInDay.sort((a, b) => b.date_time.getTime() - a.date_time.getTime());
    } else if(differenceInDays < 7) {
      this.notificationsInWeek.push(notificationResponse);
      this.notificationsInWeek.sort((a, b) => b.date_time.getTime() - a.date_time.getTime());
    } else if(differenceInDays < 31){
      this.notificationsInMonth.push(notificationResponse);
      this.notificationsInMonth.sort((a, b) => b.date_time.getTime() - a.date_time.getTime());
    }

  }


  onHaveRead(id : number) {
    this.notificationId.emit(id);
    const notificationInDay = this.notificationsInDay.find(notification => notification.id === id);
    const notificationInWeek = this.notificationsInWeek.find(notification => notification.id === id);
    const notificationInMonth = this.notificationsInMonth.find(notification => notification.id === id);
    if(notificationInDay)
      notificationInDay.read = true;
    else if (notificationInWeek)
      notificationInWeek.read = true;
    else if (notificationInMonth)
      notificationInMonth.read = true;
  }

  onReadAll() {
    this.eventReadAll.emit();
    if(this.notificationsInDay.length > 0) {
      this.notificationsInDay = this.notificationsInDay.map(notification => {
        return {
          ...notification,
          have_read : true
        }
      });
    }
    if(this.notificationsInWeek.length > 0){
      this.notificationsInWeek = this.notificationsInWeek.map(notification => {
        return {
          ...notification,
          have_read : true
        }
      });
    }
    if(this.notificationsInMonth.length > 0){
      this.notificationsInMonth = this.notificationsInMonth.map(notification => {
        return {
          ...notification,
          have_read : true
        }
      });
    }
  }

}
