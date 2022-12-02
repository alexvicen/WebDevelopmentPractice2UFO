import {
  Component,
  ViewChild,
  AfterViewInit,
  ElementRef,
  OnInit
} from '@angular/core';
import { SibligsService } from '../services/siblingsComponentService';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  constructor(private siblingsService: SibligsService) { }

  authorization: String | undefined

  @ViewChild('register', { static: true }) register!: ElementRef;
  @ViewChild('login', { static: true }) login!: ElementRef;
  @ViewChild('logOut', { static: true }) logOut!: ElementRef;

  ngOnInit(): void {
    this.siblingsService.currentData.subscribe(data => {
      this.isLogged()
    })
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
    this.authorization = localStorage["authorization"] || undefined;
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
