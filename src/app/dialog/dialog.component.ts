import { Component, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData, ScoreTable } from './dialogData';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements AfterViewInit {
  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  @ViewChild('message', { static: true }) message!: ElementRef;
  @ViewChild('table', { static: true }) table!: ElementRef;

  messageText: String = ""
  dataSource: ScoreTable[] = [];
  displayedColumns: string[] = ['username', 'punctuation', 'ufos', 'disposedTime', 'recordDate'];

  ngAfterViewInit() {
    this.message.nativeElement.style.visibility = "hidden";
    this.table.nativeElement.style.visibility = "hidden";
    if (this.data.scoreTable != undefined) {
      this.dataSource.push(this.data.scoreTable)
      this.table.nativeElement.style.visibility = "visible";
    }
    if (this.data.message != undefined) {
      this.messageText = this.data.message
      this.message.nativeElement.style.visibility = "visible";
    }

  }

  cancel() {
    this.dialogRef.close();
  }
}
