import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminLoginComponent } from './components/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { AdminEventsComponent } from './components/admin-events.component';
import { AdminContestantsComponent } from './components/admin-contestants.component';
import { AdminJudgesComponent } from './components/admin-judges.component';
import { AdminCategoriesComponent } from './components/admin-categories.component';
import { AdminCompetitionComponent } from './components/admin-competition.component';
import { AdminScoresComponent } from './components/admin-scores.component';
import { AdminSettingsComponent } from './components/admin-settings.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    AdminEventsComponent,
    AdminContestantsComponent,
    AdminJudgesComponent,
    AdminCategoriesComponent,
    AdminCompetitionComponent,
    AdminScoresComponent,
    AdminSettingsComponent,
  ],
  imports: [
    SharedModule,
    FormsModule,
    AdminRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class AdminModule {}
