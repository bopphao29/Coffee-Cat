import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants'
import { CategoryComponent } from '../dialog/category/category.component';
import { ConfimationComponent } from '../dialog/confimation/confimation.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-manage-categoty',
  templateUrl: './manage-categoty.component.html',
  styleUrls: ['./manage-categoty.component.scss']
})
export class ManageCategotyComponent implements OnInit {

  displayedColums: string[] = ['name','description', 'createdAt', 'edit']
  dataSource: any
  responseMessage: any
  
 @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private categoryService: CategoryService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ngxService.start()
    this.tableData()
  }

  tableData(){
    this.categoryService.getCategories().subscribe((reponse: any)=>{
      this.ngxService.stop();
      this.dataSource= new MatTableDataSource(reponse)
      this.dataSource.paginator = this.paginator;

    },(error: any)=>{
      this.ngxService.stop();
      if(error.error?.error){
        this.responseMessage = error.error?.error
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    
    })
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.toLowerCase();
  }

  handleAddAction(){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      action: "Add"
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
    const sub = dialogRef.componentInstance.onAddCategory.subscribe((response)=>{
      this.tableData();
    })
  }

  handleEditAction(values: any){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      action: "Edit",
      data: values
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
    const sub = dialogRef.componentInstance.onEditCategory.subscribe((response)=>{
      this.tableData();
    })
  } 

  handleDeleteAction(values : any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Xóa' + values.name+ ' danh mục'
    };
    const dialogRef = this.dialog.open(ConfimationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.start();
      this.deleteCategory(values.id);
      dialogRef.close();
    })
  }

  deleteCategory(id: any){
    this.categoryService.delete(id).subscribe((response: any)=>{
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar("Xóa danh mục thành công","Thành công")
      this.dataSource= new MatTableDataSource(response)
    },(error: any)=>{
      this.ngxService.stop();
      if(error.error?.error){
        this.responseMessage = error.error?.error
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }
}
