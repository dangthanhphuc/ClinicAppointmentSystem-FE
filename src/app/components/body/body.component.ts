import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { ResponseObject } from '../../responses/api.response';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";

@Component({
    selector: 'app-body',
    standalone: true,
    templateUrl: './body.component.html',
    styleUrl: './body.component.scss',
    imports: [
        CommonModule,
        FooterComponent,
        HeaderComponent
    ]
})
export class BodyComponent implements OnInit{
  categories : Category[] = [];

  constructor(private categoryService : CategoryService){
    
  }
  ngOnInit(): void {

    this.categoryService.getCategories().subscribe({
      next: (responseObject : ResponseObject ) => {
        this.categories = responseObject.data;
      },
      complete: () => {
        debugger;
      },
      error: (errors : any) => {
        console.log("Error fetching categories : ", errors);
      }
    });


  }

  
}
