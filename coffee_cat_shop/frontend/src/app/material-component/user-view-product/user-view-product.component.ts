import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BestSellerService } from 'src/app/services/best-seller.service';
import { CategoryService } from 'src/app/services/category.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service'
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

export interface Tile {
  color: string;
  text: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  status: number;
  categoryId: number | null;
  categoryName: string | null;
}

@Component({
  selector: 'app-user-view-product',
  templateUrl: './user-view-product.component.html',
  styleUrls: ['./user-view-product.component.scss']
})
export class UserViewProductComponent implements OnInit {

  responseMessge: any
  data: any;
  dataSource: any
  products = <any>[]
  filterProducts: Product[] = this.products;
  filterInput: boolean = false


  constructor(
    private bestSellerService: BestSellerService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private router: Router,
    private categorySerVice: CategoryService,
    private cartService: ShoppingCartService,
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getListProducts();
    this.getListCategory();
    this.updatePagination();
  }

  applyFilter(searchValue: string) {
    searchValue = searchValue.toLowerCase().trim(); // Chuyển đổi từ khóa tìm kiếm thành chữ thường và loại bỏ các khoảng trắng thừa
    this.filterProducts = this.products.filter((product: Product) =>
      product.name.toLowerCase().includes(searchValue)
    );
    this.isFilter = true

  }

  //filter
  filteredProducts = this.products;


  lengthProduct: number = 0
  isFilter: boolean = false
  onCategoryChange(event: any): void {
    // this.applyFilter('')
    const selectedCategoryId = parseInt(event.target.value, 10);
    if (selectedCategoryId === -1) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter((product: Product) => product.categoryId === selectedCategoryId);
    }
    this.isFilter = true;
    this.filterInput = true;
    this.currentPage = 1;
    this.updatePagination();
  }

  getListProducts() {
    const data = {

    }
    this.bestSellerService.getProductsList(data).subscribe((response: any) => {
      this.ngxService.stop();
      this.products = response
    }, (error: any) => {
      this.ngxService.stop();
      console.log(error);
      if (error.error?.error) {
        this.responseMessge = error.error?.error;
      } else {
        this.snackbarService.openSnackBar(this.responseMessge, GlobalConstants.error)
      }
    }

    )
  }

  categotyList: any
  getListCategory() {
    this.categorySerVice.getCategories().subscribe((data) => {
      console.log(data)
      this.categotyList = data
    })
  }

  viewProductDetail(productId: number): void {
    this.router.navigate(['/product-details', productId]);
  }

  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 0;

  updatePagination(): void {
    if (this.isFilter) {
      this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    } else {
      this.lengthProduct = Math.ceil(this.lengthProduct / this.itemsPerPage)
    }

  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProducts.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPageNoFilter(): void {
    if (this.currentPage < this.lengthProduct) {
      this.currentPage++;
    }
    this.updatePagination()
  }

  prevPageNoFilter(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    this.updatePagination()
  }

  shoppingCart() {
    this.router.navigate(['/shopping-cart'])
  }

  cartQuantity: number = 0;

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
