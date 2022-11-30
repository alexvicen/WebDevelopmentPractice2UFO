import {
  Component,
  ViewChild,
  AfterViewInit,
  ElementRef, OnInit
} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  authorization: String | undefined

  @ViewChild('register', { static: true }) register!: ElementRef;
  @ViewChild('login', { static: true }) login!: ElementRef;
  @ViewChild('logOut', { static: true }) logOut!: ElementRef;

  ngOnInit(): void {
    this.authorization = localStorage["authorization"] || undefined;

  }
  ngAfterViewInit() {
    this.isLogged()
  }

  logOutUser() {
    window.localStorage.removeItem("authorization");
    window.localStorage.removeItem("ufoPreference");
    window.localStorage.removeItem("timePreference");
    this.isLogged()
  }

  isLogged() {
    if (this.authorization != undefined) {
      this.register.nativeElement.style.visibility = "hidden";
      this.login.nativeElement.style.visibility = "hidden";
      this.logOut.nativeElement.style.visibility = "visible";
      return
    }
    this.register.nativeElement.style.visibility = "visible";
    this.login.nativeElement.style.visibility = "visible";
    this.logOut.nativeElement.style.visibility = "hidden";
  }

}
