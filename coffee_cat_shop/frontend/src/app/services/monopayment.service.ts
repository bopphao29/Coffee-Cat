import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class MonopaymentService {

  private momoEndpoint = 'https://test-payment.momo.vn/v2/gateway/api/create'; 

  constructor(
    private httpClient: HttpClient
  ) { }

  createTransaction(orderInfo: any): Observable<any> {
    const requestId = new Date().getTime().toString();
    const orderId = new Date().getTime().toString();
    const rawSignature = `partnerCode=yourPartnerCode&accessKey=yourAccessKey&requestId=${requestId}&amount=${orderInfo.total}&orderId=${orderId}&orderInfo=Thanh toán đơn hàng&redirectUrl=http://localhost:4200/payment-success&ipnUrl=http://localhost:4200/payment-notify&extraData=`;

    const payload = {
      partnerCode: 'yourPartnerCode',
      accessKey: 'yourAccessKey',
      requestId: requestId,
      amount: orderInfo.total,
      orderId: orderId,
      orderInfo: 'Thanh toán đơn hàng',
      redirectUrl: 'http://localhost:4200/payment-success',
      ipnUrl: 'http://localhost:4200/payment-notify',
      requestType: 'captureWallet',
      extraData: '', // thông tin thêm nếu có
      signature: CryptoJS.HmacSHA256(rawSignature, 'yourSecretKey').toString(CryptoJS.enc.Hex) // Chữ ký để xác thực yêu cầu
    };

    return this.httpClient.post(this.momoEndpoint, payload);
  }
  

}
