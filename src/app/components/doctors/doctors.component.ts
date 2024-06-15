import { Component, EventEmitter, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { DoctorResponse } from '../../responses/doctor.response';
import { DoctorService } from '../../services/doctor.service';
import { ResponseObject } from '../../responses/api.response';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Clinic } from '../../models/clinic';
import { ClinicService } from '../../services/clinic.service';
import { Specialty } from '../../models/specialty';
import { SpecialtyService } from '../../services/specialty.service';
import { BehaviorSubject } from 'rxjs';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { environment } from '../../../environments/environment';


@Component({
    selector: 'app-doctor',
    standalone: true,
    templateUrl: './doctors.component.html',
    styleUrl: './doctors.component.scss',
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        HeaderComponent,
        FooterComponent
    ]
})
export class DoctorsComponent implements OnInit {

  route : ActivatedRoute = inject(ActivatedRoute);

  doctors : DoctorResponse[]  = [];
  doctorsDisplay : DoctorResponse[]  = [];
  private specialtyIdSubject = new BehaviorSubject<number>(0);
  $specialtyId = this.specialtyIdSubject.asObservable();

  order : string = "";
  orderByClinic : string = ""
  orderByGender : string = "";
 
  specialtyName : string = "";

  specialties : Specialty[] = [];
  specialtiesDisplay : Specialty[] = [];
  selectedSpecialty ?: Specialty;
  clinics? : Clinic[];

  constructor(
    private doctorService : DoctorService,
    private clinicService : ClinicService,
    private specialtyService : SpecialtyService,
    private router : Router
  ){
    debugger
    this.$specialtyId.subscribe((value : number ) => {
      this.doctorsDisplay = this.doctors.filter( 
        (doctor : DoctorResponse) => {
          return doctor.specialties.map(specialty => specialty.id).includes(value);
        }
      )
    }); 
    
  }

  ngOnInit(): void {
    debugger
    this.getSpecialties();
    this.getDoctors();
    this.getClinics();
  }
  
  filterSpecialties() {
    this.specialtiesDisplay = this.specialties.filter((specialty : Specialty) => {
      return specialty.name.toUpperCase().startsWith(this.specialtyName.toUpperCase()) ; 
    });
  }

  getDoctors () : void {
    this.doctorService.getDoctors().subscribe({
      next : (response : ResponseObject) => {
        
        this.doctors = response.data;
        this.doctorsDisplay = this.doctors;

        const specialtyIdParam = Number(this.route.snapshot.queryParams['specialty']);

        if(specialtyIdParam != 0 && !Number.isNaN(specialtyIdParam)) {
          this.specialtyIdSubject.next(specialtyIdParam);
        }
        this.selectedSpecialty = this.specialties.find(specialty => specialty.id == specialtyIdParam);
      },
      error: (errors : any) => {
        debugger
        console.log("Errors from getDoctors() : " + errors);
      }
    });
  }

  getClinics() {
    this.clinicService.getClinics().subscribe({
      next: (response : ResponseObject) => {
        debugger
        this.clinics = response.data;
      },
      error: (errors : any) => {
        console.log("Errors from getClinics() : " + errors);
      }
    });
  }

  getSpecialties() : void {
    this.specialtyService.getSpecialties().subscribe({
      next: (response : ResponseObject) => {
        debugger
        this.specialties = response.data;
        this.specialtiesDisplay = this.specialties;
      },
      error : (errors : any) => {
        console.log("Errors from getSpecialties() : " + errors)
      }
    });
  }
  onChangeCategory(specialtyId : number) : void{
    this.specialtyIdSubject.next(specialtyId);
    this.selectedSpecialty = this.specialties.find(specialty => specialty.id == specialtyId);
  }

  onChangeClinics(event : any) : void {
    this.orderByClinic = event.target.value;
    this.onChangeFilter();
  }

  onChangeOrderBy(event : any) : void{
    this.order = event.target.value;
    this.onChangeFilter();
  }

  onChangedGender(event : any) : void {
    this.orderByGender = event.target.value;
    this.onChangeFilter();
  }

  onChangeFilter() {

    if(this.orderByClinic != ""){
      this.doctorsDisplay = this.doctors?.filter((x : DoctorResponse) => {
        return x.clinic.name == this.orderByClinic;
      });
    }

    if(this.order != "" ){

      if(this.order == "ASC"){
        this.doctorsDisplay = this.doctorsDisplay?.sort((a, b) => a.name.localeCompare(b.name));
      } else if(this.order == "DESC"){
        this.doctorsDisplay = this.doctorsDisplay?.sort((a, b) => b.name.localeCompare(a.name));
      }

    }

    if(this.orderByGender != "") {

      this.doctorsDisplay = this.doctorsDisplay?.filter((x : DoctorResponse) => {
        const gender : string = x.gender ? "Nam" : "Nữ";
        return  gender == this.orderByGender;
      });

    }

  }
}
