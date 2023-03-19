import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../authentication/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { GameHistoryComponent } from './game-history/game-history.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {path:'game', component: GameComponent, canActivate: [AuthGuard]},
  {path:'gamehistory', component: GameHistoryComponent, canActivate: [AuthGuard]},
  {path:'feedback', component: FeedbackComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MafiaRoutingModule {}
