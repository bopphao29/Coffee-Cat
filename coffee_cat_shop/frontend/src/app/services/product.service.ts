import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = environment.apiUrl;
  constructor(
    private httpClient : HttpClient

  ) { }

  add(data : any){
    return this.httpClient.post(this.url + "products/add",data, {
      // headers: new HttpHeaders().set('Content-Type',"multipart/form-data;")
    })
  }     

  update(data : any){
    return this.httpClient.patch(this.url + "products/update",data, {
      // headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  getProducts(data : any){
    return this.httpClient.post(this.url+ "products", data)
  }

  delete(id:any){
    return this.httpClient.delete(this.url + "products/delete/"+ id, {
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  getProductsByCategory(id: any){
    return this.httpClient.get(this.url+ "products/getByCategory/" + id)
  }

  getById(id: any){
    return this.httpClient.get(this.url+ "products/getById/" + id)
  }

  getAllProduct(){
    return this.httpClient.get(this.url + "products/get")
  }
}


