import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MafiaRoutingModule } from './mafia-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { GameComponent } from './game/game.component';
import { ErrorComponent } from './error/error.component';
import { GameHistoryComponent } from './game-history/game-history.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';


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
    FormsModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
  ]
})
export class MafiaModule { }
