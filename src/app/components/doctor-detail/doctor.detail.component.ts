import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { ResponseObject } from '../../responses/api.response';
import { CommonModule, Time } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentTimesResponse } from '../../responses/appointment.time.response';
import { DoctorResponse } from '../../responses/doctor.response';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../responses/user.response';
import { BookingDTO } from '../../dtos/appointment/booking.dto';
import { ToastService } from '../../services/share/toast.service';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-doctor.detail',
    standalone: true,
    templateUrl: './doctor.detail.component.html',
    styleUrl: './doctor.detail.component.scss',
    imports: [
        CommonModule,
        RouterModule,
        FooterComponent,
        HeaderComponent
    ]
})
export class DoctorDetailComponent implements OnInit{

  userResponse : UserResponse | null;

  route : ActivatedRoute = inject(ActivatedRoute);
  doctorId : number = 0;

  doctor?: DoctorResponse;

  // appointmentsOfDoctor: AppointmentTimesResponse[] = []; 
  // appointmentSchedules : TimeAppointment[] = []; 
  selectedIndex = 0;
  // selectedAppointmentSchedule!: TimeAppointment;
  selectedScheduleIndex = -1;
  

  constructor(
    private doctorService : DoctorService,
    private appointmentService : AppointmentService,
    private userService : UserService,
    private toastService : ToastService,
    private router : Router
  ){
    this.userResponse = this.userService.getFromLocalStorage();
    this.doctorId = Number(this.route.snapshot.params['id']);
  }

  ngOnInit(): void {
    if(this.doctorId > 0) {
      this.getDoctor();
    }
    // this.getAppointmentTimesByDoctor();
  }

  onClickDate(index : number) : void {
    this.selectedIndex = index;
    // this.selectedAppointmentSchedule = this.appointmentSchedules[index];
  }

  getDayOfWeekName(dayIndex : number ) : string {
    const daysOfWeek = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
    return daysOfWeek[dayIndex];
  }

  getDoctor() : void {
    this.doctorService.getDoctor(this.doctorId).subscribe({
      next: (response : ResponseObject) => {
        // response.data.img_url = `${environment.apiBaseUrl}/images/profile_images/${response.data.img_url}`
        this.doctor = response.data;
      },
      error: (errors : any) =>{
        console.log(errors);
      }
    });
  }

  // getAppointmentTimesByDoctor() : void {
  //   this.appointmentService.getAppointmentTimes(this.doctorId).subscribe({
  //     next: (response : ResponseObject) => {
  //       debugger
  //       this.appointmentsOfDoctor = response.data;
  //       this.appointmentsOfDoctor = this.appointmentsOfDoctor.map((appointment : AppointmentTimesResponse) => {
          
  //         const available_time_start : Date = new Date(
  //           appointment.available_time_start[0],
  //           appointment.available_time_start[1] - 1,
  //           appointment.available_time_start[2],
  //           appointment.available_time_start[3],
  //           appointment.available_time_start[4]
  //         );

  //         const available_time_end : Date = new Date(
  //           appointment.available_time_end[0],
  //           appointment.available_time_end[1] - 1,
  //           appointment.available_time_end[2],
  //           appointment.available_time_end[3],
  //           appointment.available_time_end[4]
  //         );
  //         available_time_end.getMinutes
  //         return {
  //           ...appointment,
  //           available_time_start: available_time_start,
  //           available_time_end: available_time_end 
  //         };
  //       });

  //       this.appointmentsOfDoctor.forEach((appointment : AppointmentTimesResponse) => {
  //         const dateCurrent = new Date(
  //           appointment.available_time_start.getYear(),
  //           appointment.available_time_start.getMonth(),
  //           appointment.available_time_start.getDate(),
  //         );
          

  //         const dateExistsIndex : number = this.appointmentSchedules.findIndex( s => s.date.getTime() === dateCurrent.getTime()); 

  //         if( dateExistsIndex == -1) {
  //           // Create new TimeAppointment
  //           const newDate : TimeAppointment = {
  //             date: dateCurrent,
  //             schedules: [] 
  //           };
  //           // Push schedule
  //           newDate.schedules.push({
  //             appointmentId: appointment.appointment_id,
  //             patientId: appointment.patient_id,
  //             time_start: {hours: appointment.available_time_start.getHours(), minutes: appointment.available_time_start.getMinutes()},
  //             time_end: {hours: appointment.available_time_end.getHours(), minutes: appointment.available_time_end.getMinutes()}
  //           })
  //           // Push appointmentSchedule
  //           this.appointmentSchedules.push( newDate );

  //         } else {
  //           // Push schedule
  //           this.appointmentSchedules[dateExistsIndex].schedules.push({
  //             appointmentId: appointment.appointment_id,
  //             patientId: appointment.patient_id,
  //             time_start: {hours: appointment.available_time_start.getHours(), minutes: appointment.available_time_start.getMinutes()},
  //             time_end: {hours: appointment.available_time_end.getHours(), minutes: appointment.available_time_end.getMinutes()}
  //           });

  //         }
          
  //         this.selectedAppointmentSchedule = this.appointmentSchedules[0];
  //       });
        
  //     },
  //     error: (errors : any) => {
  //       console.log(errors);
  //     }
  //   });
  // }

  onClickSchedule(index : number){
    this.selectedScheduleIndex = index;
    console.log(this.selectedScheduleIndex);
  }

  onBooking() {
    this.router.navigate([`./booking_detail`], { relativeTo: this.route });
  }

}

// interface TimeAppointment {
//   date : Date;
//   schedules: {
//     appointmentId: number;
//     patientId : number;
//     time_start : Time;
//     time_end : Time;
//   }[]
// }
