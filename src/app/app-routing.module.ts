import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/landing/landing.module').then((m) => m.LandingModule),
  },
  {
    path: 'judge',
    loadChildren: () => import('./features/judge/judge.module').then((m) => m.JudgeModule),
  },
  {
    path: 'audience',
    loadChildren: () => import('./features/audience/audience.module').then((m) => m.AudienceModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then((m) => m.AdminModule),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
