import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from './../dialog/dialogData';
import { DialogComponent } from './../dialog/dialog.component';

export interface RecordElement {
  username: string;
  punctuation: number;
  ufos: number;
  disposedTime: number;
  recordDate: number;
  recordDateFormat: string;
}
@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {
  displayedColumns: string[] = ['username', 'punctuation', 'ufos', 'disposedTime', 'recordDateFormat'];
  dataSource: RecordElement[] = [];

  constructor(private http: HttpClient, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.getRecords()
  }

  getRecords() {
    this.http.get<any>("http://wd.etsisi.upm.es:10000/records")
      .subscribe({
        error: (error) => { this.recordsTreatment(error) },
        next: (next: RecordElement[]) => {
          next.forEach(data => {
            data.recordDateFormat = new Date(data.recordDate).toLocaleDateString("es-ES")
          })
          this.dataSource = next
        },
      });
  }

  recordsTreatment(error: any) {
    switch (error.status) {
      case 401:
        this.dialog.open(DialogComponent, { data: new DialogData("no valid token", undefined) })
        break;
      case 500:
        this.dialog.open(DialogComponent, { data: new DialogData("Server error", undefined) })
        break;
      default:
        this.dialog.open(DialogComponent, { data: new DialogData("Unknown error", undefined) })
        break;
    }
  }

}
