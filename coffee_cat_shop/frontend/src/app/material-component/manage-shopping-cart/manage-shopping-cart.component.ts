import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ComfirmDeleteProductInCartComponent } from '../dialog/comfirm-delete-product-in-cart/comfirm-delete-product-in-cart.component';
import { MatDialog } from '@angular/material/dialog';

interface Product {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image: string;
  selected: boolean;
}

@Component({
  selector: 'app-manage-shopping-cart',
  templateUrl: './manage-shopping-cart.component.html',
  styleUrls: ['./manage-shopping-cart.component.scss']
})
export class ManageShoppingCartComponent implements OnInit {

  constructor(
    private router: Router,
    private shoppingService: ShoppingCartService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  productOfCart: any = []
  ngOnInit(): void {
    this.getCartByUser()
  }

  totalProduct: number = 0;

  isAtLeastOneSelected: boolean = false; // Biến để kiểm tra có ít nhất một sản phẩm được chọn
  getCartByUser() {
    this.shoppingService.getCart().subscribe((response) => {
      console.log(response)
      this.productOfCart = response
      this.updateTotal();
    })
  }

  // Hàm kiểm tra xem có ít nhất một sản phẩm được chọn hay không
  checkIfAtLeastOneSelected() {
    this.isAtLeastOneSelected = this.productOfCart.some((item: any) => item.selected);
  }

  confirmRemoval(productId: number): void {
    const dialogRef = this.dialog.open(ComfirmDeleteProductInCartComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeItem(productId);
      }
    });
  }

  updateQuantity(item: Product) {
    if (item.quantity <= 0) {
      this.openConfirmDialog(item.productId);
    } else {
      item.total = item.price * item.quantity;
      this.updateTotal();
    }
  }

  openConfirmDialog(productId: number): void {
    const dialogRef = this.dialog.open(ComfirmDeleteProductInCartComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeItem(productId);
      } else {
        this.resetQuantity(productId);
      }
    });
  }

  resetQuantity(productId: number): void {
    const item = this.productOfCart.find((product: any) => product.productId === productId);
    if (item) {
      item.quantity = 1; // Đặt lại số lượng về 1 nếu người dùng hủy bỏ
      item.total = item.price * item.quantity;
      this.updateTotal();
    }
  }

  removeItem(productId: number) {
    const data = {
      productId: productId,
    }
    this.shoppingService.deleteProduct(data).subscribe(() => {
      this.productOfCart = this.productOfCart.filter((item: any) => item.productId !== productId);
      this.snackBar.open('Đã xóa sản phẩm khỏi giỏ hàng', 'Đóng', { duration: 3000 });
      this.updateTotal();
    }, (error: any) => {
        this.snackBar.open('Lỗi khi xóa sản phẩm', 'Đóng', { duration: 3000 });
      }
    );
  }

  updateTotal(): void {
    this.totalProduct = parseFloat(this.productOfCart
      .filter((item: any) => item.selected)
      .map((item: any) => item.total)
      .reduce((total: number, value: any) => total + parseFloat(value), 0)
      .toFixed(0)
    );
    this.checkIfAtLeastOneSelected(); // Kiểm tra lại sau khi cập nhật tổng số tiền
  }

  toggleSelection(item: Product): void {
    item.selected = !item.selected;
    this.updateTotal();
  }

  checkout() {
    if (this.isAtLeastOneSelected) {
      // Chuyển đến trang đặt hàng
      this.router.navigate(['/checkout'], { state: { products: this.productOfCart.filter((item: any) => item.selected), total: this.totalProduct } });
    } else {
      // Hiển thị thông báo nếu không có sản phẩm nào được chọn
      this.snackBar.open('Vui lòng chọn ít nhất một sản phẩm để đặt hàng', 'Đóng', { duration: 3000 });
    }
  }

}
