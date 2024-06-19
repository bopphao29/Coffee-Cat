import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  url = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }
  
  getCart() {
    return this.http.get(this.url + 'cart/getByUser');
  }

  addToCart(productId: number) {
    return this.http.post(this.url + 'cart/addProduct', { productId });
  }

  deleteProduct(data: any) {
    return this.http.post(this.url + 'cart/removeProduct', data);
  }

  updateQuantity(data: any) {
    return this.http.put(this.url + 'cart/updateQuantity',data);
  }

  placeOrder(data: any) {
    return this.http.post(this.url + 'orders/placeAnOrder', data);
  }


}
