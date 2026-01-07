import { Routes } from '@angular/router';
// HomeComponent is now loaded lazily to fix hydration timing issues

export const routes: Routes = [
  // Landing page
  {
    path: '',
    loadComponent: () => import('./modules/shared/components/home/home').then(m => m.HomeComponent)
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

  {
    path: 'opportunities',
    loadComponent: () => import('./modules/shared/components/opportunities/opportunities.component').then(m => m.OpportunitiesComponent)
  },

  { path: '**', redirectTo: '' }
];
