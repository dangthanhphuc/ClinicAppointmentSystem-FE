import { Routes } from '@angular/router';
import { BodyComponent } from './components/body/body.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {  AccountPatientComponent } from './components/account/account.component';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { DoctorDetailComponent } from './components/doctor-detail/doctor.detail.component';
import { DoctorComponent } from './components/doctor/doctor.component';
import { DoctorGuardFn } from './guards/doctor.guard';
import { PatientGuardFn } from './guards/patient.guard';
import { AuthGuardFn } from './guards/auth.guard';
import { AppointmentsComponent } from './components/doctor/appointments/appointments.component';
import { AccountComponent } from './components/doctor/account/account.component';
import { ErrorsComponent } from './components/errors/errors.component';
import { AdminComponent } from './components/admin/admin.component';
import { BookingDetailComponent } from './components/booking-detail/booking-detail.component';
import { MedicalRecordsComponent } from './components/doctor/medical-records/medical-records.component';


export const routes: Routes = [
    {path: '', redirectTo: '/homepage', pathMatch: 'full'},
    {path: 'homepage', component: BodyComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    
    {path: 'account', component: AccountPatientComponent, canActivate: [AuthGuardFn]},

    //Patient
    {path: 'doctors', component: DoctorsComponent, canActivate: [PatientGuardFn]},
    {path: 'doctors/:id', component: DoctorDetailComponent, canActivate: [PatientGuardFn]},
    {path: 'doctors/:id/booking_detail', component: BookingDetailComponent, canActivate: [PatientGuardFn]},

    // Doctor
    {path: "doctor", component: DoctorComponent, canActivate : [DoctorGuardFn]
    , children: [
        {path: "appointments", component: AppointmentsComponent},
        {path: "account", component: AccountComponent },
        {path: "medical_records", component: MedicalRecordsComponent}
    ]},

    {path: "admin", component: AdminComponent},

    // Error 
    {path: "errors", component: ErrorsComponent},


    {path: '**', redirectTo: 'homepage'},


];
