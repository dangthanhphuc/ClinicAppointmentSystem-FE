import { Component, OnInit, TemplateRef, ViewChild, viewChild } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { ResponseObject } from '../../../responses/api.response';
import { error } from 'console';
import { AppointmentResponse } from '../../../responses/appointment.response';
import { DoctorResponse } from '../../../responses/doctor.response';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { AppointmentStatus } from '../../../enums/appointment.status';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Validator } from 'class-validator';
import { UpdateResultDTO } from '../../../dtos/appointment/update.result.dto';
import { ToastService } from '../../../services/share/toast.service';
import { ResultImageResponse } from '../../../responses/result.image.response';
import { environment } from '../../../../environments/environment';
import { ToastState } from '../../../enums/toast.state';

@Component({
  selector: 'app-medical-records',
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './medical-records.component.html',
  styleUrl: './medical-records.component.scss'
})
export class MedicalRecordsComponent implements OnInit{


  @ViewChild('updateResultModal') updateResultModal!: TemplateRef<any>;
  @ViewChild("detailsResultModal") detailsResultModal! : TemplateRef<any>;

  updateResultForm: FormGroup;

  doctorResponse : DoctorResponse | null = null;

  appointments : AppointmentResponse[] = [];
  indexOfSelectedAppointment : number = -1; 
  selectedAppointment : AppointmentResponse | null = null;

  updateResultDTO: UpdateResultDTO = {
    appointment_id : 0,
    clinical_diagnosis: "",
    result: "",
    files: []
  };

  // Template Form 
  clinical_diagnosis: string = '';
  result: string = '';
  files: File[] = [];
  previewUrls: string[] = [];

  constructor(
    private appointmentService : AppointmentService,
    private userService : UserService,
    private toastService : ToastService,
    private modalService : NgbModal
  ) {
    this.doctorResponse = this.userService.getValueFromLocalStorage("doctor");

    this.updateResultForm = new FormGroup({
      clinical_diagnosis : new FormControl("", Validators.required),
      result : new FormControl("", Validators.required)
    })
  }

  ngOnInit(): void {
    if(this.doctorResponse){
      this.getAppointmentByDoctorId(this.doctorResponse.id);
    }
  }

  getAppointmentByDoctorId(id : number) : void {
    this.appointmentService.getAppointmentsByDoctorId(id).subscribe({
      next: (response : ResponseObject) => {
        this.appointments = response.data;
        debugger

        this.appointments = this.appointments
        .sort((a, b) => new Date(b.available_time_start).getTime() - new Date(a.available_time_start).getTime())
        .filter((a : AppointmentResponse) => {
          return a.status == AppointmentStatus.COMPLETED || a.status == AppointmentStatus.SCHEDULED || a.status == AppointmentStatus.CANCELLED;
        });
        

        // this.appointments.map((a : AppointmentResponse) => {
        //   a.result_images?.map((result_image : ResultImageResponse) => {
        //     result_image.img_url = `${environment.apiBaseUrl}/images/result_images/${result_image.img_url}`;
        //   });
        // });

      },
      error: (error : any) => {
        console.log(error);
      }
    })
  }

  updateResult(index : number){
    this.indexOfSelectedAppointment = index;
    this.modalService.open(this.updateResultModal);
  }
  
  // onFileChange(event : any) {
  //   const files = event.target.files;
  //   debugger
  //   if (files.length > 5) {
  //     alert('Please select a maximum of 5 images.');
  //     return;
  //   }

  //   // Set files for updateResultDTO for update result
  //   this.updateResultDTO.files = files;
    
  // }

  onUpdateResult(form : any) {
    debugger
    this.updateResultDTO = {
      ...this.updateResultDTO,
      appointment_id : this.appointments[this.indexOfSelectedAppointment].id,
      clinical_diagnosis : this.updateResultForm.value.clinical_diagnosis,
      result : this.updateResultForm.value.result
    }
    
    this.appointmentService.updateResult(this.updateResultDTO).subscribe({
      next: (response : ResponseObject) => {
        this.appointments[this.indexOfSelectedAppointment] = response.data;
        // this.appointments[this.indexOfSelectedAppointment].result_images?.map((result_image : ResultImageResponse) => {
        //   result_image.img_url = `${environment.apiBaseUrl}/images/result_images/${result_image.img_url}`;
        // });
        this.toastService.sendToastMess(ToastState.SUCCESS, "Update Result", "Cập nhập kết quả khám thành công !"); 
      },
      error: (error : any) => {
        console.log(error);
      }
    });

  }

  detailResult(index : number) {
    debugger
    this.indexOfSelectedAppointment = index;
    this.selectedAppointment = this.appointments[index];
    this.modalService.open(this.detailsResultModal);
  }

  onFileChange(event: any): void {
    // Get Files
    const files = event.target.files;

    // Set files for updateResultDTO for update result
    this.updateResultDTO.files = files;
    
    // Set values for previewUrls used to preview the files
    this.previewUrls = [];
    for (let file of this.updateResultDTO.files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrls.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

}
