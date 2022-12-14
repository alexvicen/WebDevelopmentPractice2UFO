import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from './../dialog/dialogData';
import { DialogComponent } from './../dialog/dialog.component';
import { SibligsService } from '../services/siblingsComponentService';

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
export class RecordsComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['username', 'punctuation', 'ufos', 'disposedTime', 'recordDateFormat'];
  dataSource: RecordElement[] = [];
  myDataSource: RecordElement[] = [];

  authorization = localStorage["authorization"] || undefined;
  userName = localStorage["userName"] || undefined;

  @ViewChild('myScore', { static: true }) myScore!: ElementRef;

  constructor(private http: HttpClient, private dialog: MatDialog, private siblingsService: SibligsService) {
  }

  ngOnInit(): void {
    this.siblingsService.currentData.subscribe(data => {
      this.authorization = localStorage["authorization"] || undefined;
      this.getMyRecords()
    })
  }

  ngAfterViewInit() {
    this.getRecords()
    this.getMyRecords()
  }

  deleteScores() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.authorization });
    this.http.delete<any>("http://wd.etsisi.upm.es:10000/records", { headers: headers })
      .subscribe({
        error: (error) => { this.removeRecords(error) },
        next: (next) => {
          this.myDataSource = []
        },
      });
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
  getMyRecords() {
    if (this.authorization == undefined) {
      this.myScore.nativeElement.style.visibility = "hidden";
      return
    }
    this.myScore.nativeElement.style.visibility = "visible";

    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.authorization });
    this.http.get<any>("http://wd.etsisi.upm.es:10000/records/" + this.userName, { headers: headers })
      .subscribe({
        error: (error) => { this.recordsTreatment(error) },
        next: (next: RecordElement[]) => {
          if (next.length <= 0) {
            this.myScore.nativeElement.style.visibility = "hidden";
            return
          }
          this.myScore.nativeElement.style.visibility = "visible";
          next.forEach(data => {
            data.recordDateFormat = new Date(data.recordDate).toLocaleDateString("es-ES")
          })
          this.myDataSource = next
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
  removeRecords(error: any) {
    switch (error.status) {
      case 204:
        this.myDataSource = []
        break;
      case 401:
        this.dialog.open(DialogComponent, { data: new DialogData("no valid token", undefined) })
        break;
      default:
        this.dialog.open(DialogComponent, { data: new DialogData("Unknown error", undefined) })
        break;
    }
  }

}
