import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})


export class PreferencesComponent implements OnInit {

  constructor(public router: Router) { }

  @ViewChild('numUfos', { static: true }) numUfos!: ElementRef;
  @ViewChild('gameTime', { static: true }) gameTime!: ElementRef;

  ngOnInit(): void {
    var ufoPreference = localStorage["ufoPreference"] || 1;
    var timePreference = localStorage["timePreference"] || 60;
    if (ufoPreference != undefined) this.numUfos.nativeElement.value = ufoPreference;
    if (timePreference != undefined) this.gameTime.nativeElement.value = timePreference;
  }

  savePreferences() {
    console.log("ufos:" + this.numUfos.nativeElement.value);
    localStorage["ufoPreference"] = this.numUfos.nativeElement.value;
    localStorage["timePreference"] = this.gameTime.nativeElement.value;
    this.router.navigate(['/game']);
  }
}
