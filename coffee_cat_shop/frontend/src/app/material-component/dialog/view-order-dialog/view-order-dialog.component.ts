import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-view-order-dialog',
  templateUrl: './view-order-dialog.component.html',
  styleUrls: ['./view-order-dialog.component.scss']
})
export class ViewOrderDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewOrderDialogComponent>)
    { }

  ngOnInit(): void {
    console.log(this.data)
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
