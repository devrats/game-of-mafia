import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MafiaRoutingModule } from './mafia-routing.module';
import { MafiaComponent } from './mafia.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { GameComponent } from './game/game.component';


@NgModule({
  declarations: [
    MafiaComponent,
    DashboardComponent,
    GameComponent
  ],
  imports: [
    CommonModule,
    MafiaRoutingModule,
    NgCircleProgressModule
  ]
})
export class MafiaModule { }
