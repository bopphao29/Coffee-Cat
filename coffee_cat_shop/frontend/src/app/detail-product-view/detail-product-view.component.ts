import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { LoginComponent } from '../login/login.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-detail-product-view',
  templateUrl: './detail-product-view.component.html',
  styleUrls: ['./detail-product-view.component.scss']
})
export class DetailProductViewComponent implements OnInit {

  productId: number | null = null;
  product: any;
  productEntries: any;
  cartQuantity: number = 0;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private productService: ProductService,
    private cartService: ShoppingCartService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = +id; // Convert string to number
        // Load product details using this.productId
        this.getByIdOfProduct(this.productId)
      }
    });
  }

  getByIdOfProduct(id: number) {
    this.productService.getById(id).subscribe((data) => {
      this.product = data
      this.productEntries = Object.entries(this.product);
    })
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  openLoginDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "30%";
    this.dialog.open(LoginComponent, dialogConfig)
  }


  addToCart(productId: number) {
    this.cartService.addToCart(productId).subscribe((response: any) => {
      this.snackbarService.openSnackBar("Sản phẩm đã được thêm vào giỏ hàng", 'success');
      this.cartQuantity++;
    }, (error: any) => {
      console.error('Error adding product to cart:', error);
      this.snackbarService.openSnackBar("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng", 'error');
    }
    );
  }
}
