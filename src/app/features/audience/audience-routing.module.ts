import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AudienceComponent } from './audience.component';

const routes: Routes = [{ path: '', component: AudienceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AudienceRoutingModule {}
