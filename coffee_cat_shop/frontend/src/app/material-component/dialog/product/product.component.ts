import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CategoryComponent } from '../category/category.component';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ProductService } from 'src/app/services/product.service';
import { Observable } from 'rxjs';
// import { FileUploadService } from '../../services/file-upload.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();

  productForm : any = FormGroup
  dialogAction: any = "Add";
  action : any ="Lưu";
  responseMessage: any
  categorys: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<CategoryComponent>,
    private categoryService: CategoryService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private uploadService: FileUploadService
  ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      categoryId: [null,Validators.required],
      price:[null, Validators.required],
      image: [null],
      stockQuantity: [null, Validators.required],
      description:[null, Validators.required],
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = "Edit";
      this.action = "Cập nhật";
      this.productForm.patchValue(this.dialogData.data)
    }
    this.getCategories()
  }

  getCategories(){
    this.categoryService.getCategories().subscribe((response: any)=>{
      this.categorys = response;
    },(error: any)=>{
      if(error.error?.error){
        this.responseMessage = error.error?.manage;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  selectedFiles?: FileList;
  selectedFileNames: string[] = [];

  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;

  
  selectedFile : any 
  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFileNames = [];
    this.selectedFiles = event.target.files;

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      this.selectedFile = this.selectedFiles[0]
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);

        this.selectedFileNames.push(this.selectedFiles[i].name);
      }
    }
  }

  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    if (file) {
      this.uploadService.upload(file).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
            this.imageInfos = this.uploadService.getFiles();
          }
        },
        (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        }
      );
    }
  }

  uploadFiles(): void {
    this.message = [];

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }
  

 
  handleSubmit(){
    if(this.dialogAction === "Edit"){
      this.edit()
    }else{
      this.add()
    }
  }

  // edit(){
  //   var formData = this.productForm.value;
  //   var data = {
  //     id : this.dialogData.data.id,
  //     image: this.selectedFileNames[0] || 0,
  //     categoryId: formData.categoryId,
  //     name : formData.name,
  //     price: formData.price,
  //     stockQuantity: formData.stockQuantity,
  //     description: formData.description,
  //   }

  //   this.productService.update(data).subscribe((response: any) =>{
  //     this.dialogRef.close();
  //     this.onEditProduct.emit();
  //     this.responseMessage = response.message;
  //     this.snackbarService.openSnackBar(this.responseMessage, "sucess");
  //   },(error:any)=>{
  //     this.dialogRef.close();
  //     if(error.error?.error){
  //       this.responseMessage = error.error?.error;
  //     }else{
  //       this.responseMessage = GlobalConstants.genericError;
  //     }
  //     this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
  //   })

  // }

  edit() {
    const data = new FormData();
    if (this.selectedFile) {
      data.append("image", this.selectedFile);
    }
    data.append('id', this.dialogData.data.id); // Giả sử dialogData chứa ID sản phẩm
    data.append('categoryId', this.productForm.get('categoryId').value);
    data.append('name', this.productForm.get('name').value);
    data.append('price', this.productForm.get('price').value);
    data.append('stockQuantity', this.productForm.get('stockQuantity').value);
    data.append('description', this.productForm.get('description').value);
  
    this.productService.update(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onEditProduct.emit();
        this.responseMessage = response.message;
        this.snackbarService.openSnackBar(this.responseMessage, "success");
      },
      (error: any) => {
        this.dialogRef.close();
        if (error.error?.error) {
          this.responseMessage = error.error?.error;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }
  

  add(){
    const data1 = new FormData();
    data1.append("image", this.selectedFile)
    data1.append('categoryId', this.productForm.get('categoryId').value);
    data1.append('name', this.productForm.get('name').value);
    data1.append('price', this.productForm.get('price').value);
    data1.append('stockQuantity', this.productForm.get('stockQuantity').value);
    data1.append('description', this.productForm.get('description').value);
    
    this.productService.add(data1).subscribe((response: any) =>{
      console.log(data1);
      
      this.dialogRef.close();
      this.onAddProduct.emit();
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
