import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '../../shared/shared.module';
import { AudienceRoutingModule } from './audience-routing.module';
import { AudienceComponent } from './audience.component';

@NgModule({
  declarations: [AudienceComponent],
  imports: [SharedModule, FormsModule, AudienceRoutingModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
})
export class AudienceModule {}
