import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MafiaRoutingModule } from './mafia-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { GameComponent } from './game/game.component';
import { ErrorComponent } from './error/error.component';
import { GameHistoryComponent } from './game-history/game-history.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent,
    GameComponent,
    GameHistoryComponent,
    ErrorComponent,
    FeedbackComponent
  ],
  imports: [
    CommonModule,
    MafiaRoutingModule,
    NgCircleProgressModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class MafiaModule { }
