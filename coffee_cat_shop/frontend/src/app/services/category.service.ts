import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url = environment.apiUrl;
  constructor(
    private httpClient : HttpClient
  ) { }

  add(data : any){
    return this.httpClient.post(this.url + "categories/add",data, {
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  update(data : any){
    return this.httpClient.patch(this.url + "categories/update",data, {
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  getCategories(){
    return this.httpClient.get(this.url+ "categories")
  }

  edit(){
    
  }

  delete(id:any){
    return this.httpClient.delete(this.url + "categories/delete/"+ id, {
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

}
