import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OrderService } from 'src/app/services/order.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { RouteGuardService } from 'src/app/services/route-guard.service';
import { saveAs } from 'file-saver';
import { ViewOrderDialogComponent } from '../dialog/view-order-dialog/view-order-dialog.component';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

  displayedColumns: string[] = [
    'orderCode', 'orderDate', 'products', 'totalAmount', 'status', 'edit'
  ];

  dataSource: any = [];
  responseMessage: any;
  statusOptions = [
    { label: 'Tất cả', value: null },
    { label: 'Chờ xác nhận', value: 0 },
    { label: 'Chờ lấy hàng', value: 1 },
    { label: 'Chờ giao hàng', value: 2 },
    { label: 'Đã giao', value: 3 },
    { label: 'Đã hủy', value: 4 },
    { label: 'Trả hàng', value: 5 }
  ];
  selectedStatus: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private orderService: OrderService,
    private snackbarService: SnackbarService,
    private routeGuardService: RouteGuardService,
    private dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(): void {
    const data = {
      status: this.selectedStatus // Truyền trạng thái được chọn vào data
    };
    this.orderService.getOrders(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
      },
      (error: any) => {
        this.ngxService.stop();
        if (error.error?.error) {
          this.responseMessage = error.error?.error;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstants.error
        );
      }
    );
  }

  applyFilterByStatus(): void {
    this.tableData();
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'Chờ xác nhận';
      case 1:
        return 'Chờ lấy hàng';
      case 2:
        return 'Chờ giao hàng';
      case 3:
        return 'Đã giao';
      case 4:
        return 'Đã hủy';
      case 5:
        return 'Trả hàng';
      default:
        return 'Không xác định';
    }
  }

  role = this.routeGuardService.role

  updateStatus(element: any): void {
    const data = {
      id: element.id,
      status: element.status
    }
    this.orderService.updateStatus(data).subscribe(
      (response: any) => {
        this.snackbarService.openSnackBar('Cập nhật trạng thái đơn hàng thành công', 'Đóng');
      },
      (error: any) => {
        this.snackbarService.openSnackBar('Cập nhật trạng thái đơn hàng thất bại', 'Đóng');
      }
    );
  }

  startEdit(element: any): void {
    element.editing = true;
    element.newStatus = element.status;
  }

  cancelEdit(element: any): void {
    element.editing = false;
  }

  saveStatus(element: any): void {
    const data = {
      orderCode: element.orderCode,
      status: element.newStatus
    };
    this.orderService.updateStatus(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.snackbarService.openSnackBar('Cập nhật trạng thái đơn hàng thành công', 'Đóng');
        element.status = element.newStatus;
        element.editing = false;
      },
      (error: any) => {
        this.ngxService.stop();
        this.snackbarService.openSnackBar('Bạn không có quyền cập nhật trạng thái', 'Đóng');
      }
    );
  }

  downloadReportAction(element: any) {
    this.ngxService.start();
    var data = {
      fullname: element.fullname,
      phone: element.phone,
      address: element.address,
      paymentMethod: element.paymentMethod,
      totalAmount: element.totalAmount,
      productDetails: element.productDetails
    }
    this.orderService.getPDF(data).subscribe((response: any) => {
      saveAs(response, element.orderCode + '_report.pdf');
      this.ngxService.stop()
    })
  }

  isUser(): boolean {
    const role = localStorage.getItem('role');
    return role === 'admin';
  }

  viewOrderDetails(order: any): void {
    this.dialog.open(ViewOrderDialogComponent, {
      width: '600px',
      data: order
    });
  }
}