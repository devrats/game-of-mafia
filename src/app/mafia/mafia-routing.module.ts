import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MafiaComponent } from './mafia.component';

const routes: Routes = [{ path: '', component: MafiaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MafiaRoutingModule { }
