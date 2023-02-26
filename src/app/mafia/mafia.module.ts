import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MafiaRoutingModule } from './mafia-routing.module';
import { MafiaComponent } from './mafia.component';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    MafiaComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    MafiaRoutingModule
  ]
})
export class MafiaModule { }
