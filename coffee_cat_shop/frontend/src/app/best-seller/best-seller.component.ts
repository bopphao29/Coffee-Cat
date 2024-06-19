import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { BestSellerService } from '../services/best-seller.service';
import { GlobalConstants } from '../shared/global-constants';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from '../services/category.service';
import { MatPaginator } from '@angular/material/paginator';
import { LoginComponent } from '../login/login.component';

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
  selector: 'app-best-seller',
  templateUrl: './best-seller.component.html',
  styleUrls: ['./best-seller.component.scss']
})
export class BestSellerComponent implements OnInit {

  responseMessge: any
  data: any;
  dataSource: any
  products = <any>[]

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private bestSellerService: BestSellerService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private router: Router,
    private categorySerVice: CategoryService
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getListProducts();
    this.getListCategory();
    // this.updatePagination();
  }

  tiles: Tile[] = [
    { text: 'One', color: 'lightblue' },
    { text: 'Two', color: 'lightgreen' },
    { text: 'Three', color: 'lightpink' },
    { text: 'Four', color: '#DDBDF1' },
    { text: 'Five', color: 'lightblue' },
    { text: 'Six', color: 'lightgreen' },
    { text: 'Seven', color: 'lightpink' },
  ];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.products.filter = filterValue.toLowerCase();
  }

  filteredProducts = this.products;

  isFilter: boolean = false
  onCategoryChange(event: any): void {
    const selectedCategoryId = parseInt(event.target.value, 10);
    if (selectedCategoryId === -1) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter((product: Product) => product.categoryId === selectedCategoryId);
    }
    this.isFilter = true;
    this.currentPage = 1;
    this.updatePagination();
  }

  getListProducts() {
    const data = {

    }
    this.bestSellerService.getProductsList(data).subscribe((response: any) => {
      this.ngxService.stop();
      this.products = response
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
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
      // console.log(data)
      this.categotyList = data
    })
  }

  filterCategory() {

  }

  viewProductDetail(productId: number): void {
    this.router.navigate(['/product-details', productId]);
  }


  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
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

  openLoginDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "30%";
    this.dialog.open(LoginComponent, dialogConfig)
  }

  addToCart() {
    this.openLoginDialog();
  }
}
