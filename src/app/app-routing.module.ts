import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { ErrorComponent } from './mafia/error/error.component';
import { GameHistoryComponent } from './mafia/game-history/game-history.component';
import { DashboardComponent } from './mafia/dashboard/dashboard.component';
import { GameComponent } from './mafia/game/game.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'mafia',
    loadChildren: () =>
      import('./mafia/mafia.module').then((m) => m.MafiaModule),
  },
  { path: 'mafia', redirectTo: 'mafia/dashboard', pathMatch: 'full' },
  { path: 'mafia/dashboard', component: DashboardComponent },
  {path:'mafia/game', component: GameComponent},
  {path:'mafia/gamehistory', component: GameHistoryComponent},
  {path:'**', component: ErrorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
