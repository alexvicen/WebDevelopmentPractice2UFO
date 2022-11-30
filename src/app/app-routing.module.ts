import { RegisterComponent } from './register/register.component';
import { RecordsComponent } from './records/records.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { GameComponent } from './game/game.component';
import { LoginComponent } from './login/login.component';
import { IndexComponent } from './index/index.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'game', component: GameComponent },
  { path: 'preferences', component: PreferencesComponent },
  { path: 'records', component: RecordsComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
