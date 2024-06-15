import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginDTO } from '../../dtos/user/login.dto';
import { TokenService } from '../../services/token.service';
import { ResponseObject } from '../../responses/api.response';
import { UserResponse } from '../../responses/user.response';
import { UserRole } from '../../enums/user.role';
import { UserType } from '../../enums/user.type';
import { DoctorService } from '../../services/doctor.service';
import { environment } from '../../../environments/environment';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
     ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  formGroup : FormGroup;
  userResponse?: UserResponse; 

  constructor (
    private router : Router,
    private tokenService : TokenService,
    private doctorService : DoctorService,
    private userService : UserService) {
    this.formGroup = new FormGroup({
      username : new FormControl('', Validators.required),
      password : new FormControl('', Validators.required)
    });
  }

  onSubmit(){
    debugger
    const loginDTO : LoginDTO = {
      username : this.formGroup.value.username,
      password : this.formGroup.value.password
    }
    this.userService.login(loginDTO).pipe(
      switchMap((response: ResponseObject) => {
        const token = response.data.token;
        this.tokenService.setToken(token);
        return this.userService.getUserDetails();
      }),
      switchMap((response: ResponseObject) => {
        this.userResponse = response.data;
        this.userService.saveToLocalStorage(this.userResponse);

        if (response.data.user_type === UserType.DOCTOR) {
          debugger
          return this.doctorService.getDoctor(response.data.id).pipe(
            switchMap((doctorResponse: ResponseObject) => {
              // doctorResponse.data.img_url = `${environment.apiBaseUrl}/images/profile_images/${doctorResponse.data.img_url}`;
              this.userService.saveValueToLocalStorage("doctor", doctorResponse.data);
              return [doctorResponse]; // Return a single-element array to maintain the Observable chain
            })
          );
        } else {
          return [response]; // Return a single-element array to maintain the Observable chain
        }
      })
    ).subscribe({
      next: () => {
        let role = this.userResponse?.role;
        if (role === UserRole.ADMINISTRATOR) {
          this.router.navigate(['/admin']);
        } else if (role === UserRole.PATIENT) {
          this.router.navigate(['/homepage']);
        } else if (role === UserRole.DOCTOR) {
          this.router.navigate(['/doctor/appointments']);
        }
      },
      error: (errors) => {
        console.log(errors);
      }
    });
  }

}
