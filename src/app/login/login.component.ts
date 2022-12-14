
import { DialogData } from './../dialog/dialogData';
import { DialogComponent } from './../dialog/dialog.component';
import { SibligsService } from '../services/siblingsComponentService';

import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router: Router, private http: HttpClient, private dialog: MatDialog, private siblingService: SibligsService) { }


  @ViewChild('userName', { static: true }) userName!: ElementRef;
  @ViewChild('password', { static: true }) password!: ElementRef;
  @ViewChild('registerForm', { static: true }) registerForm!: ElementRef;

  loginUser() {
    this.http.get<any>("http://wd.etsisi.upm.es:10000/users/login?" + new URLSearchParams({ username: this.userName.nativeElement.value, password: this.password.nativeElement.value }))
      .subscribe({
        error: (error) => { this.loginTreatment(error) },
        next: (next) => {
          console.log("Token: " + next)
          localStorage["authorization"] = next;
          localStorage["userName"] = this.userName.nativeElement.value;
          this.siblingService.setData(true);
          this.router.navigate(['/game']);
        },
      });
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
