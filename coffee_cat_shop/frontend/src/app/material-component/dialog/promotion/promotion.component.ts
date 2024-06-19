import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PromotionService } from 'src/app/services/promotion.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {

  onAddPromotion = new EventEmitter();
  onEditPromotion = new EventEmitter();

  promotionForm: any = FormGroup
  dialogAction: any = "Add";
  action: any = "Lưu";
  responseMessage: any

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<PromotionComponent>,
    private promotionService: PromotionService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.promotionForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      percent: [null, [Validators.required]],
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
      description: [null],
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Cập nhật";
      this.promotionForm.patchValue(this.dialogData.data)
    }
  }

  handleSubmit() {
    if (this.dialogAction === "Edit") {
      this.edit()
    } else {
      this.add()
    }
  }

  edit() {
    var formData = this.promotionForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
      percent: formData.percent,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      description: formData.description,
    }

    this.promotionService.update(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEditPromotion.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "sucess");
    }, (error: any) => {
      this.dialogRef.close();
      if (error.error?.error) {
        this.responseMessage = error.error?.error;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })

  }

  add() {
    var formData = this.promotionForm.value;
    var fromDate = new Date(formData.fromDate);
    var toDate = new Date(formData.toDate);
    formData.fromDate = this.formatDate(fromDate);
    formData.toDate = this.formatDate(toDate);
    var data = {
      name: formData.name,
      percent: formData.percent,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      description: formData.description
    }

    this.promotionService.add(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddPromotion.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "sucess");
    }, (error: any) => {
      this.dialogRef.close();
      if (error.error?.error) {
        this.responseMessage = error.error?.error;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
