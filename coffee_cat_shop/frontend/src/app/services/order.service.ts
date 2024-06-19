import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  url = environment.apiUrl;
  constructor(
    private httpClient: HttpClient

  ) { }

  getOrders(data: any) {
    return this.httpClient.post(this.url + "orders", data)
  }

  updateStatus(data: any) {
    return this.httpClient.post(this.url + "orders/updateStatus", data)
  }

  getPDF(data: any):Observable<Blob>{
    return this.httpClient.post(this.url+ "orders/exportPdf/", data, {responseType: 'blob'})
  }
}
