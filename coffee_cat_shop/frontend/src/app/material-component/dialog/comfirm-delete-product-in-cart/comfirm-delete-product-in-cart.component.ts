import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-comfirm-delete-product-in-cart',
  templateUrl: './comfirm-delete-product-in-cart.component.html',
  styleUrls: ['./comfirm-delete-product-in-cart.component.scss']
})
export class ComfirmDeleteProductInCartComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ComfirmDeleteProductInCartComponent>
  ) { }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

}
