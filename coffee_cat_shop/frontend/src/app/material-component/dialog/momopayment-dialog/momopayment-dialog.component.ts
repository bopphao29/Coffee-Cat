import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-momopayment-dialog',
  templateUrl: './momopayment-dialog.component.html',
  styleUrls: ['./momopayment-dialog.component.scss']
})
export class MomopaymentDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    window.location.href = this.data.paymentUrl;
  }

}
