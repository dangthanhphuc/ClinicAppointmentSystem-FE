import { AfterViewChecked, AfterViewInit, Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgTemplateOutlet, formatDate } from '@angular/common';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { UserResponse } from '../../responses/user.response';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { ResponseObject } from '../../responses/api.response';
import { AppointmentResponse } from '../../responses/appointment.response';
import { error } from 'node:console';
import { Appointment } from '../../models/appointment';
import { User } from '../../models/user';
import { Patient } from '../../models/patient';
import { PatientDTO } from '../../dtos/patient/patient.dto';
import { PatientService } from '../../services/patient.service';
import { ToastService } from '../../services/share/toast.service';
import { ToastState } from '../../enums/toast.state';

@Component({
    selector: 'app-account',
    standalone: true,
    templateUrl: './account.component.html',
    styleUrl: './account.component.scss',
    imports: [
    HeaderComponent,
      FooterComponent,
      FontAwesomeModule,
      ReactiveFormsModule,
      CommonModule,
      NgTemplateOutlet
    ]
})
export class AccountPatientComponent implements OnInit, AfterViewInit {
  faEnvelope = faEnvelope;
  formBuilder = inject(FormBuilder);
  formGroup : FormGroup;
  isFormDirty : boolean = false;

  directiveView : string = 'isInformationAccount';

  @ViewChild('informationAccount') informationAccount!: TemplateRef<any>;
  @ViewChild('managementAppointment') managementAppointment!: TemplateRef<any>;
  currentView!: TemplateRef<any>;

  userResponse:UserResponse | null;

  appointments : AppointmentResponse[] = [];
  selectedAppointment?: AppointmentResponse;
  file : File | null = null;
  previewUrl : string | ArrayBuffer | null = null;

  constructor(
    private userService : UserService,
    private tokenService : TokenService,
    private router : Router,
    private appointmentService : AppointmentService,
    private patientService : PatientService,
    private toastService : ToastService
  ){
    
    this.userResponse = this.userService.getFromLocalStorage();
    debugger


    this.formGroup = new FormGroup({
      email : new FormControl(this.userResponse?.email, [Validators.required, Validators.email]),
      name : new FormControl(this.userResponse?.name, Validators.required),
      address : new FormControl(this.userResponse?.address),
      phone_number : new FormControl(this.userResponse?.phone_number),
      date_of_birth : new FormControl(formatDate(this.userResponse?.date_of_birth ?? new Date(), 'yyyy-MM-dd', 'en-US'), Validators.required),
      gender : new FormControl((this.userResponse?.gender ? 'Nam' : 'Nữ'), Validators.required),
      image : new FormControl()
    });

    this.formGroup.valueChanges.subscribe( () => {
      this.isFormDirty = true;
    });

  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.currentView = this.informationAccount;
    })
    
  }

  ngOnInit(): void {
    this.getAppointmentByPatientId();
  }

  onSaveChanges() { 
    
    if(this.userResponse != null){
      
      const patientDTO : PatientDTO = {...this.formGroup.value, gender: this.userResponse.gender ? true : false};
      this.patientService.updatePatient(this.userResponse.id, patientDTO).subscribe({
        next: (response : ResponseObject) => {
          const newUserResponse : UserResponse = { ...this.userResponse , ...response.data};
          this.userService.saveToLocalStorage(newUserResponse);
          this.toastService.sendToastMess(ToastState.SUCCESS, "Tài Khoản", response.message);
        },
        error: (errors : any) => {
          console.log("Errors from updatePatient$ in account.component.ts on onSaveChanges() : " + errors);
        }
      })
      if(this.file)
        this.updateProfileImage(this.userResponse.id, this.file);
    }

  }

  updateProfileImage(id: number, file : File) {
    if(this.userResponse){
      this.userService.updateProfileImage(id, file).subscribe({
        next: (response :ResponseObject) => {
          debugger
          if(this.userResponse){
            this.userResponse.img_url = response.data;
            this.userService.saveToLocalStorage(this.userResponse ?? undefined);
          }
            
        },
        error: (error : any) => {
          console.log(error);
        }
      })
    } else {
      this.toastService.sendToastMess(ToastState.ERROR, "Error", "Profile image is null");
    }
  }

  onSubmit () {
    console.log(this.formGroup.value);
  }

  onClickAppointment(appointment : AppointmentResponse) {
    this.selectedAppointment = appointment;  
  }

  getAppointmentByPatientId () : void {
    if(this.userResponse != null)
      this.appointmentService.getAppointmentsByPatientId(this.userResponse.id).subscribe({
        next: (response : ResponseObject) => {
          debugger
          this.appointments = response.data;
        },
        error: (errors : any) => {
          console.log(errors);
        }
      });
  }

  showView(view : string) {
    if (view === 'informationAccount') {
      this.currentView = this.informationAccount;
    } else if (view === 'managementAppointment') {
      this.currentView = this.managementAppointment;
    }
  }

  onLogOut(){
    this.userService.removeFromLocalStorage();
    this.tokenService.removeToken();
    this.router.navigate(['/homepage']);
  }

  onDeleteAppointment(appointmentId : number) {
    this.cancellationOfBooking(appointmentId);
    this.appointments = this.appointments.filter((appointment : AppointmentResponse) => {
      return appointment.id != appointmentId;
    })
  }

  cancellationOfBooking(appointmentId : number) {
    this.appointmentService.cancellationOfBooking(appointmentId).subscribe({
      next: (response : ResponseObject) => {
      },
      error: (errors: any) => {
        console.log(errors);
      }
    });
  }
  

  onFileChange(event: any): void {
    // Get Files
    this.file = event.target.files[0];
    
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = e.target.result;
    };
    if(this.file)
      reader.readAsDataURL(this.file);
    
  }

}
