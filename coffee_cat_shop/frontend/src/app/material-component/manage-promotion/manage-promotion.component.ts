import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PromotionService } from 'src/app/services/promotion.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { PromotionComponent } from '../dialog/promotion/promotion.component';
import { ConfimationComponent } from '../dialog/confimation/confimation.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-manage-promotion',
  templateUrl: './manage-promotion.component.html',
  styleUrls: ['./manage-promotion.component.scss']
})
export class ManagePromotionComponent implements OnInit {
  displayedColums: string[] = ['name', 'percent', 'fromDate', 'toDate', 'status', 'edit']
  dataSource: any
  responseMessage: any
  previousStatus!: boolean;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private promotionService: PromotionService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ngxService.start()
    this.tableData()
  }

  tableData() {
    const data = {

    }
    this.promotionService.getPromotions(data).subscribe((reponse: any) => {
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(reponse)
      this.dataSource.paginator = this.paginator;
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.error) {
        this.responseMessage = error.error?.error
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)

    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.toLowerCase();
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      action: "Add"
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(PromotionComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    })
    const sub = dialogRef.componentInstance.onAddPromotion.subscribe((response) => {
      this.tableData();
    })
  }

  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      action: "Edit",
      data: values
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(PromotionComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    })
    const sub = dialogRef.componentInstance.onEditPromotion.subscribe((response) => {
      this.tableData();
    })
  }

  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Xóa' + values.name + ' khuyến mãi'
    };
    const dialogRef = this.dialog.open(ConfimationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.ngxService.start();
      this.deletePromotion(values.id);
      dialogRef.close();
    })
  }

  deletePromotion(id: any) {
    this.promotionService.delete(id).subscribe((response: any) => {
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar("Xóa khuyến mãi thành công", "Thành công")
      this.tableData();
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.error) {
        this.responseMessage = error.error?.error
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }

  handChangeAction(status: any, id: any) {
    this.ngxService.start();
    var data = {
      id: id,
      status: status,
    }
    this.promotionService.apply(data).subscribe((response: any) => {
      this.ngxService.stop();
      this.responseMessage = "Áp dụng mã giảm giá thành công"
      this.snackbarService.openSnackBar(this.responseMessage, "Sucess")
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.error) {
        this.responseMessage = "Ngày áp dụng không hợp lệ"
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)

    })
  }

    toggleStatus(element: any) {
    // Kích vào giá trị của cột trạng thái để chuyển sang chế độ select
    element.editing = true;
    this.previousStatus = element.status;
  }

  applyPromotion(element: any) {
    const data = {
      id: element.id,
      status: parseInt(element.status)
    };
    this.promotionService.apply(data).subscribe(
      (response: any) => {
        this.responseMessage = "Thành công";
        this.snackbarService.openSnackBar(this.responseMessage, "Success");
        this.tableData();
      },
      (error: any) => {
        if (error.error?.error) {
          this.responseMessage = "Ngày áp dụng không hợp lệ";
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
        element.status = this.previousStatus;
      }
    );
    element.editing = false;
  }
}
