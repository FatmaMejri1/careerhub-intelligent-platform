import { Routes } from '@angular/router';
import { RecruiterDashboardComponent } from './dashboard/dashboard';
import { RecruiterHomeComponent } from './components/recruiter-home/recruiter-home';
import { RecruiterProfileComponent } from './components/recruiter-profile/recruiter-profile';
import { RecruiterJobOffersComponent } from './components/job-offers/job-offers';
import { RecruiterCandidatesComponent } from './components/candidates/candidates';
import { RecruiterAnalyticsComponent } from './components/analytics/analytics';
import { RecruiterSettingsComponent } from './components/settings/settings';
import { RecruiterGuard } from '../shared/guards/recruiter-guard';

export const recruiterRoutes: Routes = [
  {
    path: '',
    component: RecruiterDashboardComponent,
    canActivate: [RecruiterGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: RecruiterHomeComponent },
      { path: 'profile', component: RecruiterProfileComponent },
      { path: 'offers', component: RecruiterJobOffersComponent },
      { path: 'candidates', component: RecruiterCandidatesComponent },
      { path: 'analytics', component: RecruiterAnalyticsComponent },
      { path: 'settings', component: RecruiterSettingsComponent },
      { path: '**', redirectTo: 'home' }
    ]
  }
];
