import { Routes } from '@angular/router';
import { HomeComponent } from './modules/shared/components/home/home';

export const routes: Routes = [
  // Landing page
  {
    path: '',
    component: HomeComponent
  },

  // Optional alias for home
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },

  {
    path: 'about',
    loadComponent: () => import('./modules/shared/components/about/about').then(m => m.AboutComponent)
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin-module')
        .then(m => m.AdminModule)
  },

  {
    path: 'candidate',
    loadChildren: () =>
      import('./modules/candidate/candidate-module')
        .then(m => m.CandidateModule)
  },

  {
    path: 'recruiter',
    loadChildren: () =>
      import('./modules/recruiter/recruiter-module')
        .then(m => m.RecruiterModule)
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth-module')
        .then(m => m.AuthModule)
  },

  { path: '**', redirectTo: '' }
];
