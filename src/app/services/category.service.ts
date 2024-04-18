import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ResponseObject } from '../responses/api.response';
import { CategoryDTO } from '../dtos/category/category.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly apiBaseUrl : string = environment.apiBaseUrl + '/categories';

  constructor(private http : HttpClient) { }

  getCategories () : Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}`);
  }

  getCategory (id : number ) : Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.apiBaseUrl}/${id}`);
  }

  createCategory(categoryDTO : CategoryDTO) : Observable<ResponseObject>  {
    return this.http.post<ResponseObject>(`${this.apiBaseUrl}`, categoryDTO);
  }

  updateCategory(id : number, categoryDTO : CategoryDTO) : Observable<ResponseObject>{
    return this.http.put<ResponseObject>(`${this.apiBaseUrl}/update/${id}`, categoryDTO);
  } 

  deleteCategory(id : number) : Observable<ResponseObject>{
    return this.http.delete<ResponseObject>(`${this.apiBaseUrl}/delete/${id}`);
  }
  

}
