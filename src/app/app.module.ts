import { SibligsService } from './services/siblingsComponentService';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table'
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { GameComponent } from './game/game.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { RecordsComponent } from './records/records.component';
import { RegisterComponent } from './register/register.component';
import { DialogComponent } from './dialog/dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    IndexComponent,
    LoginComponent,
    GameComponent,
    PreferencesComponent,
    RecordsComponent,
    RegisterComponent,
    DialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatTableModule
  ],
  providers: [SibligsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
