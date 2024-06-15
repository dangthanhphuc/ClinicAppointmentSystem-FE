import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserResponse } from '../../../responses/user.response';
import { UserService } from '../../../services/user.service';
import { UserType } from '../../../enums/user.type';
import { DoctorService } from '../../../services/doctor.service';
import { ResponseObject } from '../../../responses/api.response';
import { DoctorResponse } from '../../../responses/doctor.response';
import { CommonModule, formatDate } from '@angular/common';
import { ClinicService } from '../../../services/clinic.service';
import { ClinicResponse } from '../../../responses/clinic.response';
import { error } from 'console';
import { DoctorDTO } from '../../../dtos/doctor/doctor.dto';
import { response } from 'express';
import { ToastService } from '../../../services/share/toast.service';
import { UpdatePassDTO } from '../../../dtos/user/update.pass.dto';
import { TokenService } from '../../../services/token.service';
import { Router } from '@angular/router';
import { SpecialtyService } from '../../../services/specialty.service';
import { SpecialtyResponse } from '../../../responses/specialty.response';
import { Specialty } from '../../../models/specialty';
import { environment } from '../../../../environments/environment';
import { ToastState } from '../../../enums/toast.state';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit{

  doctorResponse : DoctorResponse;

  // Data Bindings
  specialties : SpecialtyResponse[] = [];
  clinics : ClinicResponse[] = [];
  selectedClinicId : number = 0 ;
  productImageUrl : string | ArrayBuffer | null = "";
  profileImage: File | null = null;

  // Data Handle 
  isAccountFormChanged = false;
  isUpdatePassFormChanged = false;
  doctorSpecialties : Specialty[] = [];

  // Form Group
  accountForm !: FormGroup;
  updatePasswordForm !: FormGroup;

  constructor(
    private userService : UserService,
    private doctorService : DoctorService,
    private clinicService : ClinicService,
    private toastService : ToastService,
    private tokenService : TokenService,
    private specialtyService : SpecialtyService,
    private router : Router
  ) {
    debugger
    this.doctorResponse = this.userService.getValueFromLocalStorage("doctor");
    this.productImageUrl = this.doctorResponse.img_url;
    this.doctorSpecialties = this.doctorResponse.specialties;
    
    // Initialize account form
      this.accountForm = new FormGroup({
        id: new FormControl(this.doctorResponse.id),
        name : new FormControl(this.doctorResponse.name),
        email : new FormControl(this.doctorResponse.email),
        address : new FormControl(this.doctorResponse.address),
        phone_number : new FormControl(this.doctorResponse.phone_number),
        date_of_birth : new FormControl( formatDate(this.doctorResponse.date_of_birth, 'yyyy-MM-dd', 'en-US')),
        gender : new FormControl(this.doctorResponse.gender),
        clinic : new FormControl(this.doctorResponse.clinic.id)
      });
    
    this.accountForm.valueChanges.subscribe(() => {
      this.isAccountFormChanged = true;
    });
    
    // Initialize change password form
    this.updatePasswordForm = new FormGroup({
      old_pass : new FormControl(""),
      new_pass : new FormControl(""),
      confirm_pass : new FormControl("")
    });

    this.updatePasswordForm.valueChanges.subscribe(() => {
      this.isUpdatePassFormChanged = true;
    });
 
  }

  ngOnInit(): void {
    this.getSpecialties();
    this.getClinics();
  }

  getClinics(): void {
    this.clinicService.getClinics().subscribe({
      next: (response : ResponseObject) => {
        this.clinics = response.data;
      },
      error: (error : any) => {
        console.log("Error from getClinics() in AccountComponent : " + error);
      }
    })
  }

  ngUpdateAccount() : void {
    
    let doctorDTO : DoctorDTO = new DoctorDTO(this.accountForm.value);
    doctorDTO = {...doctorDTO, specialties: this.doctorSpecialties.map(specialty => specialty.id)};
    debugger
    this.updateDoctor(this.doctorResponse.id, doctorDTO);
    
  }

  updateDoctor(id: number, doctorDTO : DoctorDTO) : void {
    this.doctorService.updateDoctor(id, doctorDTO).subscribe({
      next: (response : ResponseObject) => {
        debugger
        this.doctorResponse = response.data;
        this.userService.saveValueToLocalStorage("doctor", this.doctorResponse);
        this.toastService.sendToastMess(ToastState.SUCCESS, "Update", "Cập nhập thông tin người dùng thành công !");
      },
      error: (error : any) => {
        console.log(error);
      }
    })
  }

  updateProfileImage() {
    if(this.profileImage) {
      this.userService.updateProfileImage(this.doctorResponse.id ,this.profileImage).subscribe({
        next: (response :ResponseObject) => {
          debugger
          this.doctorResponse.img_url = response.data;
          this.userService.saveValueToLocalStorage("doctor", this.doctorResponse);
          this.productImageUrl = this.doctorResponse.img_url;
          this.toastService.sendToastMess(ToastState.SUCCESS, "Success", "Update profile image successfully");
        },
        error: (error : any) => {
          console.log(error);
        }
      })
    } else {
      this.toastService.sendToastMess(ToastState.ERROR, "Error", "Profile image is null");
    }
    
  }

  onUpdatePass() {
    const updatePassDTO : UpdatePassDTO = new UpdatePassDTO(this.updatePasswordForm.value);
    this.resetPass(this.doctorResponse.id, updatePassDTO);
  }

  resetPass(id : number, updatePassDTO : UpdatePassDTO) {
    this.userService.resetPassword(id, updatePassDTO).subscribe({
      next: (response : ResponseObject) => {
        debugger
        this.toastService.sendToastMess(ToastState.SUCCESS, "Success", "Cập nhập mật khẩu thành công");
        // this.userService.removeValueFromLocalStorage("doctor");
        // this.tokenService.removeToken();
        this.userService.clearFormLocalStorage();
        this.router.navigate(['/login']);
      },
      error: (error : any) => {
        this.toastService.sendToastMess(ToastState.ERROR, "Error", "Cập nhập thất bại");
        console.log(error);
      }
    });
  }

  addSpecialty(event : any) {

    if(!this.isAccountFormChanged) {
      this.isAccountFormChanged = true;
    }
    
    const existedSpecialty = this.doctorSpecialties.find(specialty => specialty.id == event.target.value);

    if(existedSpecialty == undefined){
      const newSpecialty : Specialty | undefined  = this.specialties.find(specialty => specialty.id == event.target.value);
      
      if(newSpecialty != undefined) {
        this.doctorSpecialties.push(newSpecialty);
      }
    }
  }

  deleteSpecialty(index : number) : void{
    if(!this.isAccountFormChanged) {
      this.isAccountFormChanged = true;
    }
    this.doctorSpecialties.splice(index, 1);
  }

  getSpecialties () {
    this.specialtyService.getSpecialties().subscribe({
      next: (response : ResponseObject) => {
        this.specialties = response.data;
      }, 
      error: (error : any) => {
        console.log(error);
      }
    });
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onAvatarChange(event : any) {
    debugger
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      this.profileImage = file;

      reader.onload = () => {
        this.productImageUrl = reader.result;
      };
      reader.readAsDataURL(file);

      this.updateProfileImage();
    }


  }
  
}
