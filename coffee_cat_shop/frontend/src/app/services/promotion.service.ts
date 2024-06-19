import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  url = environment.apiUrl;
  constructor(
    private httpClient : HttpClient
  ) { }

  add(data : any){
    return this.httpClient.post(this.url + "promotions/create",data, {
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  update(data : any){
    return this.httpClient.patch(this.url + "promotions/update",data, {
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  getPromotions(data: any){
    return this.httpClient.post(this.url+ "promotions", data, {
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  apply(data : any){
    return this.httpClient.patch(this.url + "promotions/apply",data, {
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  delete(id:any){
    return this.httpClient.post(this.url + "promotions/delete/"+ id, {
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }
}
