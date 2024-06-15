import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { CommonModule, formatDate } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Calendar, CalendarOptions, EventAddArg, EventContentArg, EventDropArg, EventSourceInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';

import { RouterModule } from '@angular/router';
import { AppointmentResponse } from '../../../responses/appointment.response';
import { AppointmentService } from '../../../services/appointment.service';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/share/toast.service';
import { ResponseObject } from '../../../responses/api.response';
import { AppointmentDTO } from '../../../dtos/appointment/appointment.dto';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { timeRangeValidator } from '../../../utils/validator.custom';
import { DoctorResponse } from '../../../responses/doctor.response';
import { AppointmentStatus } from '../../../enums/appointment.status';
import { ToastState } from '../../../enums/toast.state';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FullCalendarModule,
    NgbModule
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent implements OnInit{
  
  doctorResponse : DoctorResponse | null;

  appointments : AppointmentResponse[] = [];

  //
  @ViewChild('eventModal') eventModal!: TemplateRef<any>;
  @ViewChild('addModal') addModal!: TemplateRef<any>;
  @ViewChild("calendar") calendarComponent!: FullCalendarComponent;

  // Data Binding
  selectedAppointment: AppointmentResponse | null = null;

  // Calendar 
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    locales: [viLocale],
    locale: 'vi',
    initialView: 'timeGridWeek',
    selectable: true, // enable selecting
    editable: true, // enable dragging and resizing
    select: this.handleDateSelect.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this),
    events: [],
    eventClick: this.eventClick.bind(this),
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth, timeGridWeek, timeGridDay, listWeek'
    }
  };

  //Form
  appointmentForm : FormGroup;
  addAppointmentForm : FormGroup;

  // Handle variables 
  currentDate : string;
  tomorrowDate : string;
 
  constructor(
    private appointmentService : AppointmentService,
    private userService : UserService,
    private toastService : ToastService,
    private modalService: NgbModal
  ){
    this.doctorResponse = this.userService.getValueFromLocalStorage("doctor");
    this.currentDate = formatDate(new Date(), "yyyy-MM-dd",'en-US');

    // Form Group
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.tomorrowDate = formatDate(tomorrow, "yyyy-MM-dd HH:mm",'en-US');
    this.appointmentForm = new FormGroup({
      available_time_start : new FormControl("", [Validators.required]),
      available_time_end : new FormControl("", [Validators.required])
    });


    // addAppointmentForm FormGroup
    this.addAppointmentForm = new FormGroup({
      dateAppointment : new FormControl("", [Validators.required]),
      time_start_appointment : new FormControl("", [Validators.required]),
      time_end_appointment : new FormControl("", [Validators.required])
    }, { validators: timeRangeValidator('time_start_appointment', 'time_end_appointment') });

  }

  handleDateSelect(selectInfo: any) {

    const appointmentApi = this.calendarComponent.getApi();

    appointmentApi.unselect();

    debugger
    // Check end date không qua ngày hôm sau => start == end date

    this.addAppointmentForm.patchValue({
      dateAppointment: selectInfo.startStr.split('T')[0],
      time_start_appointment: selectInfo.startStr.split('T')[1].substring(0, 5),
      time_end_appointment: selectInfo.endStr.split('T')[1].substring(0, 5)
    });
    this.modalService.open(this.addModal);
    // const calendarApi = selectInfo.view.calendar;
    // calendarApi.unselect(); // clear date selection
  }

  handleEventDrop(dropInfo: EventDropArg) {
    // Lấy event old and new
    const{event, oldEvent} = dropInfo;

    // Lấy dữ liệu trước và sau thay đổi
    const oldStart= oldEvent.startStr;
    const oldEnd = oldEvent.endStr;
    const eventStart = event.startStr;
    const eventEnd = event.endStr;

    const hasChanged = (oldStart != eventStart) || (oldEnd != eventEnd);

    if(hasChanged && eventStart && eventEnd) {
      if(this.doctorResponse){
        const date = eventStart.split('T')[0];
        const appointmentDTO : AppointmentDTO = {
          doctor_id: this.doctorResponse.id,
          available_time_start: `${date}T${eventStart.split('T')[1].substring(0, 5)}`,
          available_time_end: `${date}T${eventEnd.split('T')[1].substring(0, 5)}`,
        }
        debugger
        this.updateAppointment(Number(dropInfo.event.id), appointmentDTO);
      }
      
    }

  }

  handleEventResize(resizeInfo : EventResizeDoneArg) {
    const calendarApi = this.calendarComponent.getApi();
    // Update the calendar
    const event = calendarApi.getEventById(resizeInfo.event.id);
    event?.setStart(resizeInfo.event.startStr);
    event?.setEnd(resizeInfo.event.endStr);
    // Update database
    if(this.doctorResponse) {
      const date = resizeInfo.event.startStr.split('T')[0];
      const appointmentDTO : AppointmentDTO = {
        doctor_id: this.doctorResponse.id,
        available_time_start: `${date}T${resizeInfo.event.startStr.split('T')[1].substring(0, 5)}`,
        available_time_end: `${date}T${resizeInfo.event.endStr.split('T')[1].substring(0, 5)}`
      };
      this.updateAppointment(Number(resizeInfo.event.id), appointmentDTO);
    }
  }

  ngOnInit(): void {
    this.getAppointmentByDoctorId();
  }

  eventClick(arg : any) : any {
    const calendarApi : Calendar= this.calendarComponent.getApi();
    const eventToView = calendarApi.getEventById(arg.event.id);
    console.log(arg.event.id);
    debugger
    if(eventToView && eventToView.start && eventToView.end) {
      this.selectedAppointment = {
        id : Number(eventToView.id),
        available_time_start : eventToView.start,
        available_time_end : eventToView.end,
        status : eventToView.extendedProps['status'],
        appointment_type_name : eventToView.extendedProps['appointment_type_name'],
        doctor : eventToView.extendedProps['doctor'],
        patient : eventToView.extendedProps['patient'],
        note: eventToView.extendedProps['note'],
        clinical_diagnosis: "",
        result: ""
      }
    }
    this.modalService.open(this.eventModal);
  }

  getAppointmentByDoctorId() : void {
    const doctorId =  this.doctorResponse?.id;
    if(doctorId){
      this.appointmentService.getAppointmentsByDoctorId(doctorId).subscribe({
        next: (response : ResponseObject) => {
          this.calendarOptions.events = response.data.map((appointment : AppointmentResponse) => {
            const calendar = {
              id : appointment.id.toString(),
              title : appointment.status != AppointmentStatus.PENDING ? appointment.appointment_type_name : "Chưa hẹn",
              start : appointment.available_time_start.toString(),
              end : appointment.available_time_end.toString(),
              classNames: this.backgroundClassification(appointment.status),
              extendedProps : {
                "doctor" : appointment.doctor,
                "patient" : appointment.patient,
                "status" : appointment.status,
                "appointment_type_name" : appointment.appointment_type_name,
                "note": appointment.note
              }
            }
            return calendar;
          });
          debugger
        },
        error: (error : any ) => {
          console.log("Error from getAppointmentByDoctorId : " + error);
        }
      });
    }

  }

  backgroundClassification(status : string) : string[] {
    const classNames : string[] = ['text-white'];
    switch(status) {
      case AppointmentStatus.SCHEDULED : 
        classNames.push("bg-info");
        break;
      case AppointmentStatus.COMPLETED :
        classNames.push("bg-success");
        break;
      case AppointmentStatus.PENDING :
        classNames.push("bg-warning"); 
        break;
      case AppointmentStatus.CANCELLED :
        classNames.push("bg-danger");
        break;
    }
    
    return classNames;
  }

  addAppointment() : void {
    debugger
    if(this.doctorResponse){
      const date = this.addAppointmentForm.value.dateAppointment;
      const appointmentDTO : AppointmentDTO = {
        doctor_id : this.doctorResponse.id,
        available_time_start: `${date}T${this.addAppointmentForm.value.time_start_appointment}`,
        available_time_end: `${date}T${this.addAppointmentForm.value.time_end_appointment}`
      }
      this.appointmentService.create(appointmentDTO).subscribe({
        next: (response : ResponseObject) => {
          // Tạo biến lưu event
          const event = {
            id : response.data.id,
            title: response.data.status != AppointmentStatus.PENDING ? response.data.appointment_type_name : "Chưa hẹn",
            start: response.data.available_time_start,
            end: response.data.available_time_end,
            classNames: this.backgroundClassification(response.data.status),
            extendedProps : {
              "doctor" : response.data.doctor,
              "patient" : response.data.patient,
              "status" : response.data.status,
              "appointment_type_name" : response.data.appointment_type_name
            }
          };
          // Thêm vào calendar events
          const calendarApi = this.calendarComponent.getApi();
          calendarApi.addEvent(event);
          // Gửi Toast thông báo
          this.toastService.sendToastMess(ToastState.SUCCESS, "Add Calendar", "Thêm event thành công !");
        },
        error: (error : any) => {
          console.log(error);
        }
      });
      
    }
  }

  updateAppointment(id: number, appointmentDTO : AppointmentDTO) {
    this.appointmentService.update(id, appointmentDTO).subscribe({
      next: (response : ResponseObject) => {
        // Thêm vào calendar events
        const calendarApi = this.calendarComponent.getApi();
        const eventById = calendarApi.getEventById(id.toString());
        eventById?.setStart(response.data.available_time_start);
        eventById?.setEnd(response.data.available_time_end)
        // Gửi Toast thông báo
        this.toastService.sendToastMess(ToastState.SUCCESS , "Update Calendar", "Cập nhập event thành công !");
      },  
      error: (errors : any) => {
        console.log(errors);
      }
    });
  }

  onDelete(id : number) : void {
    const calendarApi = this.calendarComponent.getApi();
    // Remove event from calendar
    calendarApi.getEventById(id.toString())?.remove();
    // Remove in database
    this.deleteAppointment(id);
    
  }


  deleteAppointment(id : number) : void {
    this.appointmentService.delete(id).subscribe({
      next: (response : ResponseObject) => {
        this.toastService.sendToastMess(ToastState.SUCCESS, "Delete Appointment", "Xóa lịch thành công !");
      },
      error: (error : any) => {
        console.log(error);
      }
    })
  }



}

