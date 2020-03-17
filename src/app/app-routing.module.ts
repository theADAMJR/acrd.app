import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthService } from './auth.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'commands', component: HomeComponent },
  { path: 'login', component: HomeComponent },
  { path: 'invite', redirectTo: AuthService.inviteLink },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
