import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MafiaRoutingModule } from './mafia-routing.module';
import { MafiaComponent } from './mafia.component';


@NgModule({
  declarations: [
    MafiaComponent
  ],
  imports: [
    CommonModule,
    MafiaRoutingModule
  ]
})
export class MafiaModule { }
