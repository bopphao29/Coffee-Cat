import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BestSellerService {

  url = environment.apiUrl;

  constructor(
    private httpClient : HttpClient
  ) { }

  getProductsList(data: any) {
    return this.httpClient.post(this.url + "products", data)
  }
}
