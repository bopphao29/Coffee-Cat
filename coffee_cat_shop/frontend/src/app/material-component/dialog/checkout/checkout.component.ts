import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ConfirmOrderComponent } from '../confirm-order/confirm-order.component';
import { MonopaymentService } from 'src/app/services/monopayment.service';
import { MomopaymentDialogComponent } from '../momopayment-dialog/momopayment-dialog.component';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  // fullname: string = JSON.parse(localStorage.getItem('fullname') || '"');
  fullname: string = ''
  phone: string = '';
  address: string = '';
  paymentMethod: string = '';
  note: string = '';
  productDetails: any[] = [];
  total: number = 0;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private shoppingService: ShoppingCartService,
    private monoPayment : MonopaymentService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.productDetails = navigation.extras.state.products;
      this.total = navigation.extras.state.total;
    } else {
      this.router.navigate(['/cart']);
    }
   }

  ngOnInit(): void {
    const storedFullname = localStorage.getItem('fullname');
    if (storedFullname) {
      this.fullname = storedFullname;
    }
  }

  // placeOrder() {
  //   const dialogRef = this.dialog.open(ConfirmOrderComponent, {
  //     width: '400px',
  //     data: { fullname: this.fullname, phone: this.phone, address: this.address, paymentMethod: this.paymentMethod, note: this.note, productDetails: this.productDetails, total: this.total }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       const orderData = { fullname: this.fullname, phone: this.phone, address: this.address, paymentMethod: this.paymentMethod, note: this.note, productDetails: this.productDetails, total: this.total };
  //       this.shoppingService.placeOrder(orderData).subscribe(response => {
  //         this.snackBar.open('Đặt hàng thành công!', 'Đóng', { duration: 3000 });
  //       }, error => {
  //         console.error('Đặt hàng thất bại:', error);
  //         this.snackBar.open('Đặt hàng thất bại. Vui lòng thử lại sau.', 'Đóng', { duration: 3000 });
  //       });
  //     }
  //   });
  // }

  placeOrder() {
    if (this.paymentMethod === 'Chuyển khoản') {
      this.createMomoTransaction();
    } else {
      this.confirmOrder();
    }
  }

  confirmOrder() {
    const dialogRef = this.dialog.open(ConfirmOrderComponent, {
      width: '400px',
      data: {
        fullname: this.fullname,
        phone: this.phone,
        address: this.address,
        paymentMethod: this.paymentMethod,
        note: this.note,
        productDetails: this.productDetails,
        total: this.total
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const orderData = {
          fullname: this.fullname,
          phone: this.phone,
          address: this.address,
          paymentMethod: this.paymentMethod,
          note: this.note,
          productDetails: this.productDetails,
          total: this.total
        };
        this.shoppingService.placeOrder(orderData).subscribe(response => {
          this.snackBar.open('Đặt hàng thành công!', 'Đóng', { duration: 3000 });
        }, error => {
          console.error('Đặt hàng thất bại:', error);
          this.snackBar.open('Đặt hàng thất bại. Vui lòng thử lại sau.', 'Đóng', { duration: 3000 });
        });
      }
    });
  }

  createMomoTransaction() {
    const orderInfo = {
      fullname: this.fullname,
      phone: this.phone,
      address: this.address,
      paymentMethod: this.paymentMethod,
      note: this.note,
      productDetails: this.productDetails,
      total: this.total
    };

    this.monoPayment.createTransaction(orderInfo).subscribe((response: any) => {
      const paymentUrl = response.payUrl;
      this.dialog.open(MomopaymentDialogComponent, {
        width: '400px',
        data: { paymentUrl }
      });
    }, error => {
      console.error('Tạo giao dịch thất bại:', error);
      this.snackBar.open('Tạo giao dịch thất bại. Vui lòng thử lại sau.', 'Đóng', { duration: 3000 });
    });
  }
}
