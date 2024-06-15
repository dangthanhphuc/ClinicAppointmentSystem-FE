import { CommonModule, DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, Injectable, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserCircle, faBell} from '@fortawesome/free-solid-svg-icons';
import { UserResponse } from '../../responses/user.response';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotificationComponent } from "../notification/notification.component";
import { NotificationService } from '../../services/notification.service';
import { NotificationResponse } from '../../responses/notification.response';
import { ResponseObject } from '../../responses/api.response';
import { response } from 'express';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    imports: [
        CommonModule,
        NgbModule,
        FontAwesomeModule,
        RouterModule,
        NotificationComponent
    ]
})
export class HeaderComponent implements OnInit, AfterViewInit{
  faUserCircle = faUserCircle;
  
  @ViewChild("isNotLogged") isNotLogged!: TemplateRef<any>;
  @ViewChild("isLogged") isLogged!: TemplateRef<any>;
  userState!: TemplateRef<any>;

  @ViewChild('noNotification') noNotification!: TemplateRef<any>;
  @ViewChild('haveNotification') haveNotification!: TemplateRef<any>;
  currentView!: TemplateRef<any>;

  userResponse: UserResponse | null;
  userId : number;

  notifications : NotificationResponse[] = [];

  constructor(
    @Inject(DOCUMENT) private document : Document,
    private userService : UserService,
    private tokenService : TokenService,
    private notificationService : NotificationService,
    private router : Router
  ){
    this.userResponse = this.userService.getFromLocalStorage();

    if(this.userResponse)
      this.userId = this.userResponse.id;
    else{
      this.userId = 0;
    }
      
    this.currentView = this.haveNotification;
  }
  

  ngOnInit(): void {

    this.getNotificationsByUserId();

    this.notificationService.notification$.subscribe({
      next: (notificationResponse : NotificationResponse | null) => {
        debugger
        if(notificationResponse && notificationResponse.user_id == this.userId)
          this.notifications = [...this.notifications, notificationResponse];
      }
    });

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.checkUserState();
    })
  }

  handleItemClick(index : number) {
    debugger
    if(index == 2){
      this.userService.removeFromLocalStorage();
      this.tokenService.removeToken();
      this.userResponse = this.userService.getFromLocalStorage();
      this.checkUserState();
      window.location.reload();
      this.router.navigate(['/login']);
    }
  }

  checkUserState() : void {
    if(this.userResponse){
      this.userState = this.isLogged;
    } else {
      this.userState = this.isNotLogged;
    }
  }

  getNotificationsByUserId() {
    if(this.userResponse)
      this.notificationService.getAllByUserId(this.userResponse.id).subscribe({
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
    this.readAll(this.userId);
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
