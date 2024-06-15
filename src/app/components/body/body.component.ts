import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { ResponseObject } from '../../responses/api.response';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../responses/user.response';
import { Router, RouterModule } from '@angular/router';
import { SpecialtyService } from '../../services/specialty.service';
import { Specialty } from '../../models/specialty';
import { ClinicResponse } from '../../responses/clinic.response';
import { ClinicService } from '../../services/clinic.service';


@Component({
    selector: 'app-body',
    standalone: true,
    templateUrl: './body.component.html',
    styleUrl: './body.component.scss',
    imports: [
        CommonModule,
        FooterComponent,
        HeaderComponent,
        RouterModule
    ]
})
export class BodyComponent implements OnInit{

  isSpecialtiesClsShow : boolean = false;
  @ViewChild("btnSpecialtiesShow", {static: true}) btnSpecialtiesShow!: ElementRef;

  isClinicsClsShow : boolean = false;
  @ViewChild("btnClinicsShow", {static: true}) btnClinicsShow!: ElementRef;

  
  specialties : Specialty[] = [];
  specialtiesHead : Specialty[] = [];
  clinics : ClinicResponse[]  = [];
  clinicsHead: ClinicResponse[] = [];

  userResponse: UserResponse | null;

  

  constructor(
    private userService : UserService,
    private specialtyService : SpecialtyService,
    private clinicService : ClinicService,
    private router : Router
  ){
    this.userResponse = this.userService.getFromLocalStorage();    
  }

  ngOnInit(): void {
    this.getSpecialties();
    this.getClinics();
  }

  getClinics() : void {
    this.clinicService.getClinics().subscribe({
      next: (response : ResponseObject) => {
        this.clinics = response.data;
        this.clinicsHead  = this.clinics.splice(0,4);
      },
      error: (errors : any) => {
        console.log(errors);
      }
    });
  }

  getSpecialties() : void {
    this.specialtyService.getSpecialties().subscribe({
      next: (responseObject : ResponseObject ) => {
        this.specialties = responseObject.data;
        this.specialtiesHead = this.specialties.splice(0,4);
      }, 
      error: (errors : any) => {
        console.log("Error fetching getSpecialties() !"); 
      }
    });
  }

  onCardClick(name : string, id : number) {
    this.router.navigate(['/doctors'], {queryParams: {specialty: id}});
  }
  
  onChangeCollapse(type : string){
    if(type === "specialties"){
      this.isSpecialtiesClsShow = !this.isSpecialtiesClsShow;
      this.btnSpecialtiesShow.nativeElement.textContent = this.isSpecialtiesClsShow ? "THU GỌN" : "XEM THÊM";
    } else if(type === "clinics"){
      this.isClinicsClsShow = !this.isClinicsClsShow;
      this.btnClinicsShow.nativeElement.textContent = this.isClinicsClsShow ? "THU GỌN" : "XEM THÊM";
    }
  }
}
