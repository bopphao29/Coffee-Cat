import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.apiUrl;

  constructor(
    private httpClient : HttpClient
  ) { }

  login(data : any){
    return this.httpClient.post(this.url + "users/signin",data, {
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  signUp(data : any){
    return this.httpClient.post(this.url + "users/signup",data, {
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }


  checkToken(){
     return this.httpClient.get(this.url +  "users/checkToken");
  }

  changePassword(data: any){
    return this.httpClient.post(this.url + "users/changepassword", data,{
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  getUsers(){
    return this.httpClient.get(this.url + "users");
  }

  updateStatus(data:any){
    return this.httpClient.patch(this.url + "users/updateStatus/", data,{
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  updateInfo(data:any){
    return this.httpClient.patch(this.url + "users/updateInfo/", data,{
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }
}
