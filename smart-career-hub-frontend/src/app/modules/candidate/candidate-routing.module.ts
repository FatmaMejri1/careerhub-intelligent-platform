import { Routes } from '@angular/router';
import { CandidateDashboardComponent } from './dashboard/dashboard';
import { CandidateHome } from './components/candidate-home/candidate-home';
import { MyProfile } from './components/my-profile/my-profile';
import { candidateGuard } from '../shared/guards/candidate-guard';

export const candidateRoutes: Routes = [
  {
    path: '',
    component: CandidateDashboardComponent,
    canActivate: [candidateGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: CandidateHome },
      { path: 'my-profile', component: MyProfile },
      { path: 'my-applications', loadComponent: () => import('./components/my-applications/my-applications').then(m => m.MyApplicationsComponent) },
      { path: 'trainings', loadComponent: () => import('./components/trainings/trainings').then(m => m.TrainingsComponent) },
      { path: 'cv-manager', loadComponent: () => import('./components/cv-manager/cv-manager').then(m => m.CvManagerComponent) },
      { path: 'settings', loadComponent: () => import('./components/settings/settings').then(m => m.SettingsComponent) },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];
