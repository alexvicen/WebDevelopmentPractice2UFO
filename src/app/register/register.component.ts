import { DialogData } from './../dialog/dialogData';
import { DialogComponent } from './../dialog/dialog.component';
import { SibligsService } from '../services/siblingsComponentService';

import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private router: Router, private http: HttpClient, private dialog: MatDialog, private siblingService: SibligsService) { }

  @ViewChild('userName', { static: true }) userName!: ElementRef;
  @ViewChild('userNameDiv', { static: true }) userNameDiv!: ElementRef;
  @ViewChild('email', { static: true }) email!: ElementRef;
  @ViewChild('password', { static: true }) password!: ElementRef;
  @ViewChild('repeatPassword', { static: true }) repeatPassword!: ElementRef;


  focusout() {
    if (this.userName.nativeElement.value.length <= 0) return;
    this.checkUserNameExist();
  };


  checkUserNameExist() {
    this.http.get<any>("http://wd.etsisi.upm.es:10000/users/" + this.userName.nativeElement.value)
      .subscribe({
        error: (error) => { this.checkUserNameTreatment(error) },
        next: (next) => {
          this.showErrorDialog("User name in use", this.userNameDiv, this.userName);
        },
      });

  }

  registerUser() {
    if (this.password.nativeElement.value.length > 8) {
      alert("The password can contain a maximum of 8 characters");
      return;
    }

    if (this.password.nativeElement.value != this.repeatPassword.nativeElement.value) {
      alert("Passwords must match");
      return;
    }

    this.http.post<any>("http://wd.etsisi.upm.es:10000/users",
      {
        username: this.userName.nativeElement.value,
        email: this.email.nativeElement.value,
        password: this.password.nativeElement.value
      })
      .subscribe({
        error: (error) => { this.registerTreatment(error) },
        next: (next) => {
          this.loginUser();
        },
      });
  }

  loginUser() {
    this.http.get<any>("http://wd.etsisi.upm.es:10000/users/login?" + new URLSearchParams({ username: this.userName.nativeElement.value, password: this.password.nativeElement.value }))
      .subscribe({
        error: (error) => { this.loginTreatment(error) },
        next: (next) => {
          localStorage["authorization"] = next;
          localStorage["userName"] = this.userName.nativeElement.value;
          this.siblingService.setData(true);
          this.router.navigate(['/game']);
        },
      });
  }

  checkUserNameTreatment(error: any) {
    switch (error.status) {
      case 404:
        break;
      case 500:
        this.showErrorDialog("Server error", undefined, undefined);
        break;
      default:
        this.showErrorDialog("Unknown error", undefined, undefined);
        break;
    }
  }

  registerTreatment(error: any) {
    switch (error.status) {
      case 400:
        this.showErrorDialog("No username or email or password", undefined, this.userName);
        break;
      case 409:
        this.showErrorDialog("Duplicated user name", this.userNameDiv, this.userName);
        break;
      case 500:
        this.showErrorDialog("Server error", undefined, undefined);
        break;
      default:
        this.showErrorDialog("Unknown error", undefined, undefined);
        break;
    }
  }

  loginTreatment(error: any) {
    switch (error.status) {
      case 400:
        this.showErrorDialog("no username or password", undefined, this.userName);
        break;
      case 401:
        this.showErrorDialog("invalid username/password supplied", undefined, this.userName);
        break;
      case 500:
        this.showErrorDialog("Server error", undefined, undefined);
        break;
      default:
        this.showErrorDialog("Unknown error", undefined, undefined);
        break;
    }
  }

  showErrorDialog(messageText: String, divTarget?: ElementRef, tarjetInput?: ElementRef) {
    const dialog = this.dialog.open(DialogComponent, { data: new DialogData(messageText, undefined) })
    dialog.afterClosed().subscribe(art => {
      tarjetInput?.nativeElement.focus();
    });
  }
}
