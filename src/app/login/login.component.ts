import { Component, ViewChild, ElementRef, } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private http: HttpClient) { }

  @ViewChild('userName', { static: true }) userName!: ElementRef;
  @ViewChild('password', { static: true }) password!: ElementRef;
  @ViewChild('dialog', { static: true }) dialog!: ElementRef;
  @ViewChild('registerForm', { static: true }) registerForm!: ElementRef;

  loginUser() {
    this.http.get<any>("http://wd.etsisi.upm.es:10000/users/login?" + new URLSearchParams({ username: this.userName.nativeElement.value, password: this.password.nativeElement.value }))
      .subscribe({
        error: (error) => { this.loginTreatment(error) },
        next: (next) => {
          localStorage["authorization"] = next;
          localStorage["userName"] = this.userName.nativeElement.value;
          history.back();
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
    if (divTarget != undefined) {
      divTarget.nativeElement.removeClass("neon_text");
      divTarget.nativeElement.addClass("neon_text_error");
    }

    this.dialog.nativeElement.classList.add("ui-dialog-titlebar");
    this.dialog.nativeElement.classList.add("ui-widget-header");
    this.dialog.nativeElement.classList.add("ui-corner-all");
    this.dialog.nativeElement.classList.add("ui-helper-clearfix");
    this.dialog.nativeElement.classList.add("container_neon_border");
    this.dialog.nativeElement.classList.add("neon_text");
    this.dialog.nativeElement.append('<p #message class="neon_text text-center">' + messageText + "</p>");
    this.dialog.nativeElement
      .dialog({
        title: "Error",
        modal: true,
        position: {
          my: "left",
          at: "right",
          of: this.registerForm,
        },
      })
      .prev(".ui-dialog-titlebar")
      .css("background", "rgb(152, 246, 255)");

    this.dialog.nativeElement.on("dialogclose", function (event: any) {
      document.querySelector('#message')?.remove();
      if (tarjetInput != undefined) {
        tarjetInput.nativeElement.focus();
      }
    });
  }

}
