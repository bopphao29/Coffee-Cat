import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from 'src/app/shared/global-constants'
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';
import { ConfimationComponent } from '../dialog/confimation/confimation.component';
import { saveAs } from 'file-saver';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'email',
    'contactNumber',
    'paymentMethod',
    'total',
    'view'
  ]
  dataSource: any = [];

  responseMessge: any

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private billService: BillService,
    private productService: ProductService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData()
  }

  tableData() {
    this.billService.getBills().subscribe((reponse: any) => {
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(reponse)
      this.dataSource.paginator = this.paginator;
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.error) {
        this.responseMessge = error.error?.error
      } else {
        this.responseMessge = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessge, GlobalConstants.error)

    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.toLowerCase();
  }

  handleViewAction(values: any) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      data: values
    }
    dialogConfig.width = "100%";
    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    })
  }

  downloadReportAction(values: any) {
    this.ngxService.start();
    var data = {
      name: values.name,
      email: values.email,
      uuid: values.uuid,
      contactNumber: values.contactNumber,
      paymentMethod: values.paymentMethod,
      totalAmount: values.total,
      productDetails: values.productDetails
    }
    this.billService.getPDF(data).subscribe((response: any) => {
      saveAs(response, values.uuid + '.pdf');
      this.ngxService.stop()
    })
  }

  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      message: 'Xóa ' + values.name + ' bill'
    }
    const dialogRef = this.dialog.open(ConfimationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response: any) => {
      this.ngxService.start();
      this.deleteProduct(values.id);
      dialogRef.close();

    })
  }

  deleteProduct(id: any) {
    this.billService.delete(id).subscribe((response: any) => {
      this.ngxService.stop()
      this.tableData()
      this.responseMessge = response?.message;
      this.snackbarService.openSnackBar(this.responseMessge, "Success");
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.error) {
        this.responseMessge = error.error?.error
      } else {
        this.responseMessge = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessge, GlobalConstants.error)

    })
  }
}
