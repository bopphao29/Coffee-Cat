import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confimation',
  templateUrl: './confimation.component.html',
  styleUrls: ['./confimation.component.scss']
})
export class ConfimationComponent implements OnInit {

  onEmitStatusChange = new EventEmitter

  details: any = {}

  constructor( @Inject(MAT_DIALOG_DATA) public dialogData: any) { }

  ngOnInit(): void {
    if(this.dialogData){
      this.details = this.dialogData
    }
  }

  handleChangeAction(){
    this.onEmitStatusChange.emit();
  }
}
