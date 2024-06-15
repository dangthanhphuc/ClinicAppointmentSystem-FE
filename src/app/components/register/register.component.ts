import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../utils/validator.custom';
import { CommonModule } from '@angular/common';
import { Clinic } from '../../models/clinic';
import { ClinicService } from '../../services/clinic.service';
import { UserService } from '../../services/user.service';
import { RegisterDoctor } from '../../dtos/user/register.doctor.dto';
import { ResponseObject } from '../../responses/api.response';
import { RegisterPatient } from '../../dtos/user/register.patient.dto';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{

  clinics : Clinic[] | null= null;

  patientFormGroup : FormGroup;
  doctorFormGroup : FormGroup;
  users = ['Người Dùng', 'Bác Sĩ'];
  selectedUser : string = 'Người Dùng';
  

  constructor(
    private clinicService : ClinicService,
    private userService : UserService
  ) {
    this.patientFormGroup = new FormGroup({
      username : new FormControl('', Validators.required),
      password : new FormControl('', Validators.required),
      retypePassword : new FormControl('', [Validators.required]),
      email : new FormControl(''),
      name : new FormControl('', Validators.required),
      address : new FormControl(''),
      phoneNumber: new FormControl('', Validators.required),
      gender : new FormControl('', Validators.required),
      dateOfBirth : new FormControl('', Validators.required)
    }, {validators : passwordMatchValidator});

    this.doctorFormGroup = new FormGroup({
      username : new FormControl('', Validators.required),
      password : new FormControl('', Validators.required),
      retypePassword : new FormControl('', [Validators.required]),
      email : new FormControl(''),
      name : new FormControl('', Validators.required),
      address : new FormControl(''),
      phoneNumber: new FormControl('', Validators.required),
      gender : new FormControl('', Validators.required),
      dateOfBirth : new FormControl('', Validators.required),
      clinicId : new FormControl('', Validators.required)
    }, {validators : passwordMatchValidator});

  }

  ngOnInit(): void {
    
    this.clinicService.getClinics().subscribe({
      next : (response) => {
        debugger;
        this.clinics = response.data;
      },
      error: (errors) => {
        console.error('Error fetching detail:', errors);
      }
    });


  }

  onSubmitPatient(){
    const registerPatient : RegisterPatient = {
      email : this.patientFormGroup.value.email,
      name : this.patientFormGroup.value.name,
      address : this.patientFormGroup.value.address,
      phone_number : this.patientFormGroup.value.phoneNumber,
      date_of_birth : this.patientFormGroup.value.dateOfBirth ,
      gender : this.patientFormGroup.value.gender,
      username : this.patientFormGroup.value.username,
      password : this.patientFormGroup.value.password,
      retype_password : this.patientFormGroup.value.retypePassword
    };
    debugger;
    this.userService.registerPatient(registerPatient).subscribe({
      next : (response : ResponseObject) => {
        console.log(response);
      },
      error : (errors : any) => {
        console.log(errors);
      }
    });
    
  }

  onSubmitDoctor() {
    
    debugger;
    const registerDoctor : RegisterDoctor = {
      email : this.doctorFormGroup.value.email,
      name : this.doctorFormGroup.value.name,
      address : this.doctorFormGroup.value.address,
      phone_number : this.doctorFormGroup.value.phoneNumber,
      date_of_birth : this.doctorFormGroup.value.dateOfBirth ,
      gender : this.doctorFormGroup.value.gender,
      username : this.doctorFormGroup.value.username,
      password : this.doctorFormGroup.value.password,
      retype_password : this.doctorFormGroup.value.retypePassword,
      clinic_id : this.doctorFormGroup.value.clinicId
    };
    console.log(registerDoctor);
    this.userService.registerDoctor(registerDoctor).subscribe({
      next: (response : ResponseObject) => {
        debugger;
        console.log(response);
      },  
      error: (errors : any) => {
        console.log(errors);
      }
    });
  }

  onSelectedUser(selectedUser : string){
    this.selectedUser = selectedUser;
  }

  showTemplate(userTemplate : string ) : boolean {
    return userTemplate === this.selectedUser;
  }

}
