import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../responses/user.response';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { DoctorResponse } from '../../responses/doctor.response';
import { ResponseObject } from '../../responses/api.response';
import { debug, error } from 'console';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentTimesResponse } from '../../responses/appointment.time.response';
import { CommonModule, Time, formatDate } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { environment } from '../../../environments/environment';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingDTO } from '../../dtos/appointment/booking.dto';
import { ToastService } from '../../services/share/toast.service';
import { AppointmentTypeService } from '../../services/appointment.type.service';
import { response } from 'express';
import { AppointmentType } from '../../models/appointment.type';
import { AppointmentTypeDTO } from '../../dtos/appointment-type/appointment.type.dto';
import { AppointmentTypeResponse } from '../../responses/appointment.type.response';
import { ToastState } from '../../enums/toast.state';
import { NotificationService } from '../../services/notification.service';
import { NotificationDTO } from '../../dtos/notification/notification.dto';
import { NotificationType } from '../../enums/notification.type';
import { NotificationResponse } from '../../responses/notification.response';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule
  ],
  templateUrl: './booking-detail.component.html',
  styleUrl: './booking-detail.component.scss'
})
export class BookingDetailComponent implements OnInit{

  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef<any>;

  userResponse : UserResponse | null = null;
  doctorId : number;
  doctorResponse : DoctorResponse | null = null;
  appointmentsOfDoctor: AppointmentTimesResponse[] = [];
  appointmentSchedules : TimeAppointment[] = []; 
  selectedAppointmentSchedule?: TimeAppointment;
  indexOfSchedule : number = -1;
  indexOfAppointmentSchedules : number = -1;
  appointmentTypes : AppointmentTypeResponse[] = [];

  // Form
  additionalForm : FormGroup;

  constructor(
    private userService : UserService,
    private doctorService : DoctorService,
    private appointmentService : AppointmentService,
    private route : ActivatedRoute,
    private appointmentTypeService : AppointmentTypeService,
    private notificationService : NotificationService,
    private toastService : ToastService
  ) {
    this.userResponse = this.userService.getFromLocalStorage();
    this.doctorId = this.route.snapshot.params['id'];

    this.additionalForm = new FormGroup({
      appointment_type : new FormControl("", [Validators.required]),
      note : new FormControl(""),
    });
  }

  ngOnInit(): void {
    this.getDoctor();
    this.getAppointmentsByDoctorId();
    this.getAppointmentTypes();
  }

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -200, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 200, behavior: 'smooth' });
  }

  getDoctor() : void {
    this.doctorService.getDoctor(this.doctorId).subscribe({
      next: (response : ResponseObject) => {
        this.doctorResponse = response.data;
      },
      error: (error : any) => { 
        console.log(error);
      }
    })
  }

  getDayOfWeekName(dayIndex : number ) : string {
    const daysOfWeek = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
    return daysOfWeek[dayIndex];
  }

  getAppointmentsByDoctorId() {
    this.appointmentService.getAppointmentTimes(this.doctorId).subscribe({
      next: (response : ResponseObject) => {
        this.appointmentsOfDoctor = response.data.map((appointment : AppointmentTimesResponse) => {
          
          const available_time_start : Date = new Date(
            appointment.available_time_start[0],
            appointment.available_time_start[1] - 1,
            appointment.available_time_start[2],
            appointment.available_time_start[3],
            appointment.available_time_start[4]
          );

          const available_time_end : Date = new Date(
            appointment.available_time_end[0],
            appointment.available_time_end[1] - 1,
            appointment.available_time_end[2],
            appointment.available_time_end[3],
            appointment.available_time_end[4]
          );
          available_time_end.getMinutes
          return {
            ...appointment,
            available_time_start: available_time_start,
            available_time_end: available_time_end 
          };
        });

        this.appointmentsOfDoctor.forEach((appointment : AppointmentTimesResponse) => {
          
          const dateCurrent = new Date(
            appointment.available_time_start.getFullYear(),
            appointment.available_time_start.getMonth(),
            appointment.available_time_start.getDate(),
          );
          

          const dateExistsIndex : number = this.appointmentSchedules.findIndex( s => s.date.getTime() === dateCurrent.getTime()); 

          if( dateExistsIndex == -1) {
            // Create new TimeAppointment
            const newDate : TimeAppointment = {
              date: dateCurrent,
              schedules: [] 
            };
            // Push schedule
            newDate.schedules.push({
              appointmentId: appointment.appointment_id,
              patientId: appointment.patient_id,
              time_start: {hours: appointment.available_time_start.getHours(), minutes: appointment.available_time_start.getMinutes()},
              time_end: {hours: appointment.available_time_end.getHours(), minutes: appointment.available_time_end.getMinutes()}
            })
            // Push appointmentSchedule
            this.appointmentSchedules.push( newDate );

          } else {
            // Push schedule
            this.appointmentSchedules[dateExistsIndex].schedules.push({
              appointmentId: appointment.appointment_id,
              patientId: appointment.patient_id,
              time_start: {hours: appointment.available_time_start.getHours(), minutes: appointment.available_time_start.getMinutes()},
              time_end: {hours: appointment.available_time_end.getHours(), minutes: appointment.available_time_end.getMinutes()}
            });

          }
        });

        // Sort schedules of appointmentSchedules
        this.appointmentSchedules.forEach((value : TimeAppointment) => {
          return {
            ...value,
            schedules : value.schedules.sort((a, b) => a.time_start.hours - b.time_start.hours)
          }
        });

        this.indexOfAppointmentSchedules = 0;
        this.selectedAppointmentSchedule = this.appointmentSchedules[0];

      },
      error: (error : any) => {
        console.log(error);
      }
    })
  }

  getAppointmentTypes() {
    this.appointmentTypeService.getAppointmentTypes().subscribe({
      next: (response : ResponseObject) => {
        this.appointmentTypes = response.data;
      },
      error: (error : any) => {
        console.log(error);
      }
    });
  }

  onClickDate(index : number) : void{
    debugger
    this.indexOfAppointmentSchedules = index; 
    this.selectedAppointmentSchedule = this.appointmentSchedules[this.indexOfAppointmentSchedules];
  }

  changeSchedule(indexOfSchedule : number) : void {
    debugger
    this.indexOfSchedule = indexOfSchedule;
  }

  booking() {
    debugger
    const appointmentId = this.selectedAppointmentSchedule?.schedules[this.indexOfSchedule].appointmentId;
    if(this.userResponse && appointmentId) {
      const bookingDTO : BookingDTO = {
        patient_id: this.userResponse.id,
        appointment_id: appointmentId,
        appointment_type_id: this.additionalForm.value.appointment_type,
        note: this.additionalForm.value.note
     }
      this.bookingAppointment(bookingDTO);
    }
    
  }

  bookingAppointment(bookingDTO : BookingDTO) : void {
    this.appointmentService.bookingAppointment(bookingDTO).subscribe({
      next: (response : ResponseObject) => {
        this.toastService.sendToastMess(ToastState.SUCCESS, "Đặt hẹn", "Đặt hẹn thành công");

        // Create notification for patient
        const notificationDTOForPatient : NotificationDTO = {
          user_id : this.userResponse ? this.userResponse.id : 0,
          title : "Đặt hẹn thành công",
          message : `Cuộc hẹn của bạn và ${this.doctorResponse?.name} sẽ bắt đầu vào lúc ${formatDate(response.data.available_time_end, "HH:mm", 'en-US') }-${formatDate(response.data.available_time_start, "HH:mm  MM-dd-yyyy", 'en-US') } !`,
          type: NotificationType.SUCCESS
        };

        // Create motification for doctor
        const notificationDTOForDoctor : NotificationDTO = {
          user_id : response.data.doctor.id,
          title : "Nhận hẹn thành công",
          message : `Cuộc hẹn vào ${formatDate(response.data.available_time_end, "HH:mm", 'en-US') }-${formatDate(response.data.available_time_start, "HH:mm  MM-dd-yyyy", 'en-US') } đã được đặt. Vui lòng kiểm tra !`,
          type : NotificationType.INFORMATION
        }

        this.notificationService.creates([notificationDTOForPatient, notificationDTOForDoctor]).subscribe({
          next: (response : ResponseObject) => {
            response.data.map((notification : NotificationResponse)=> {
              notification.date_time = new Date(response.data.date_time);
              this.notificationService.sendMessage(notification); 
            })
          },
          error: (error : any) => {
            console.log(error);
          }
        })
      },
      error: (error : any) => {
        console.log(error);
      }
    });
  }
}

interface TimeAppointment {
  date : Date;
  schedules: {
    appointmentId: number;
    patientId : number;
    time_start : Time;
    time_end : Time;
  }[]
}
