import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '../../shared/shared.module';
import { JudgeRoutingModule } from './judge-routing.module';
import { JudgeComponent } from './judge.component';
import { JudgeLoginComponent } from './components/judge-login.component';

@NgModule({
  declarations: [JudgeComponent, JudgeLoginComponent],
  imports: [SharedModule, FormsModule, JudgeRoutingModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
})
export class JudgeModule {}
