import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { AdminEventsComponent } from './components/admin-events.component';
import { AdminContestantsComponent } from './components/admin-contestants.component';
import { AdminJudgesComponent } from './components/admin-judges.component';
import { AdminCategoriesComponent } from './components/admin-categories.component';
import { AdminCompetitionComponent } from './components/admin-competition.component';
import { AdminScoresComponent } from './components/admin-scores.component';
import { AdminSettingsComponent } from './components/admin-settings.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'events', component: AdminEventsComponent },
      { path: 'contestants', component: AdminContestantsComponent },
      { path: 'judges', component: AdminJudgesComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'competition', component: AdminCompetitionComponent },
      { path: 'scores', component: AdminScoresComponent },
      { path: 'settings', component: AdminSettingsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
