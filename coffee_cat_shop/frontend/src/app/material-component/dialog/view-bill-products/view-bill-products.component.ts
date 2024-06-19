import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CategoryComponent } from '../category/category.component';


@Component({
  selector: 'app-view-bill-products',
  templateUrl: './view-bill-products.component.html',
  styleUrls: ['./view-bill-products.component.scss']
})
export class ViewBillProductsComponent implements OnInit {

  displayedColums: string[] = ['name','category','product','price','quantity','total']
  dataSource : any
  data: any

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<CategoryComponent>,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.data = this.dialogData.data;
    this.dataSource = JSON.parse(this.dialogData.data.productDetails)
  }
}
