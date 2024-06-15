import { Component, OnInit,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DoctorResponse } from '../../responses/doctor.response';
import { UserService } from '../../services/user.service';
import { NotificationComponent } from "../notification/notification.component";
import { NotificationResponse } from '../../responses/notification.response';
import { NotificationService } from '../../services/notification.service';
import { ResponseObject } from '../../responses/api.response';

@Component({
    selector: 'app-doctor',
    standalone: true,
    templateUrl: './doctor.component.html',
    styleUrl: './doctor.component.scss',
    imports: [
        CommonModule,
        RouterModule,
        NotificationComponent
    ]
})
export class DoctorComponent implements OnInit{
  
  doctorResponse : DoctorResponse;

  // Notification Component
  notifications : NotificationResponse[] = [];

  constructor(
    private userService : UserService,
    private notificationService : NotificationService,
    private router : Router
  ){
    this.doctorResponse = this.userService.getValueFromLocalStorage("doctor");
    debugger
  }
  ngOnInit(): void {
    this.getNotificationsByUserId();

    this.notificationService.notification$.subscribe({
      next: (notificationResponse : NotificationResponse | null) => {
        debugger
        if(notificationResponse)
          this.notifications = [...this.notifications, notificationResponse];
      }
    });
  }

  logout() {
    this.userService.clearFormLocalStorage();
    this.router.navigate(['/login']);
  }

  getNotificationsByUserId() {

      this.notificationService.getAllByUserId(this.doctorResponse.id).subscribe({
        next: (response : ResponseObject) => {
          debugger
          this.notifications = response.data;
          this.notifications = this.notifications.map(a  => {return {...a, date_time: new Date(a.date_time)}})
        },
        error: (error : any) => {
          debugger
          console.log(error);
        }
      });
  }

  handleNotificationId(data : number) {
    this.haveRead(data);
  }
 
  haveRead(id : number) : void {
    this.notificationService.haveRead(id).subscribe({
      next: (response : ResponseObject)  => {
        this.notifications = this.notifications.map(notification =>
          notification.id === id ? { ...notification, have_read: true } : notification
        );
      }, 
      error : (error : any) => {
        console.log(error);
      }
    })
  }

  handleEventReadAll() {
    this.readAll(this.doctorResponse.id);
  }

  readAll(id : number) {
    this.notificationService.readAll(id).subscribe({
      next: (response : ResponseObject) => {
        this.notifications = this.notifications.map(notification =>{
          return { ...notification, have_read: true }
        });
      },
      error: (error : any) => {
        console.log(error);
      }
    });
  }

}
