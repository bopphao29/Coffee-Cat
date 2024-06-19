import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();

  categoryForm : any = FormGroup
  dialogAction: any = "Add";
  action : any ="Lưu";
  responseMessage: any

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private snackbarService: SnackbarService,
  private dialogRef: MatDialogRef<CategoryComponent>,
  private categoryService: CategoryService,
  private formBuilder: FormBuilder
) { }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      description: [null],
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = "Edit";
      this.action = "Cập nhật";
      this.categoryForm.patchValue(this.dialogData.data)
    }
  }

  handleSubmit(){
    if(this.dialogAction === "Edit"){
      this.edit()
    }else{
      this.add()
    }
  }

  edit(){
    var formData = this.categoryForm.value;
    var data = {
      id : this.dialogData.data.id,
      name : formData.name,
      description: formData.description,
    }

    this.categoryService.update(data).subscribe((response: any) =>{
      this.dialogRef.close();
      this.onEditCategory.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "sucess");
    },(error:any)=>{
      this.dialogRef.close();
      if(error.error?.error){
        this.responseMessage = error.error?.error;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })

  }

  add(){
    var formData = this.categoryForm.value;
    var data = {
      name : formData.name,
      description: formData.description
    }

    this.categoryService.add(data).subscribe((response: any) =>{
      this.dialogRef.close();
      this.onAddCategory.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "sucess");
    },(error:any)=>{
      this.dialogRef.close();
      if(error.error?.error){
        this.responseMessage = error.error?.error;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }
}
