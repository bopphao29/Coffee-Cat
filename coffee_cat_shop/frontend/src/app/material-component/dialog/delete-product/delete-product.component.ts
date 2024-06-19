import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.scss']
})
export class DeleteProductComponent implements OnInit {

  
  onEmitStatusChange = new EventEmitter

  details: any = {}

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) { }

  ngOnInit(): void {
    if(this.dialogData){
      this.details = this.dialogData
    }
  }

  handleChangeAction(){
    this.onEmitStatusChange.emit();
  }

}
