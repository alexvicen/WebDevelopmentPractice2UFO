import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from './../dialog/dialog.component';
import { DialogData } from './../dialog/dialogData';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss']
})
export class ChangePassComponent {

  constructor(private router: Router, private http: HttpClient, private dialog: MatDialog) { }

  @ViewChild('password', { static: true }) password!: ElementRef;
  @ViewChild('repeatPassword', { static: true }) repeatPassword!: ElementRef;

  authorization = localStorage["authorization"] || undefined;
  userName = localStorage["userName"] || undefined;

  changePassword() {
    if (this.password.nativeElement.value.length > 8) {
      alert("The password can contain a maximum of 8 characters");
      return;
    }
    if (this.password.nativeElement.value != this.repeatPassword.nativeElement.value) {
      alert("Passwords must match");
      return;
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.authorization });
    this.http.patch<any>("http://wd.etsisi.upm.es:10000/users/" + this.userName,
      {
        password: this.password.nativeElement.value
      }, { headers: headers })
      .subscribe({
        error: (error) => { this.changePasswordTreatment(error) },
        next: (next) => {
          this.passwordChangedRedirect()
        },
      });
  }

  changePasswordTreatment(error: any) {
    switch (error.status) {
      case 204:
        this.passwordChangedRedirect()
        break;
      case 401:
        this.dialog.open(DialogComponent, { data: new DialogData("No valid token", undefined) })
        break;
      case 500:
        this.dialog.open(DialogComponent, { data: new DialogData("Server error", undefined) })
        break;
      default:
        this.dialog.open(DialogComponent, { data: new DialogData("Unknown error", undefined) })
        break;
    }
  }
  passwordChangedRedirect() {
    const dialog = this.dialog.open(DialogComponent, { data: new DialogData("Password changed", undefined) })
    dialog.afterClosed().subscribe(art => {
      console.log("RESULT: " + art)
      if (art == true && this.authorization != undefined) {
        this.router.navigate(['/index']);
        return
      }
      location.reload();
    });
  }
}
