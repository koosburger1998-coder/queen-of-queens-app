import { NgModule } from '@angular/core';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [LandingComponent],
  imports: [SharedModule, LandingRoutingModule, MatIconModule],
})
export class LandingModule {}
