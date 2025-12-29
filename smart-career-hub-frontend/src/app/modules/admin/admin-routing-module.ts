import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/dashboard';
import { AdminHomeComponent } from './components/admin-home/admin-home';
import { AdminProfileComponent } from './components/admin-profile/admin-profile';
import { AdminOffersComponent } from './components/offers/offers';
import { AdminUsersComponent } from './components/users/users';
import { AdminSettingsComponent } from './components/settings/settings';
import { AdminFraudComponent } from './components/fraud/fraud';
import { AdminNotificationsComponent } from './components/notifications/notifications';
import { adminGuard } from '../shared/guards/admin-guard';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminHomeComponent },
      { path: 'profile', component: AdminProfileComponent },
      { path: 'offers', component: AdminOffersComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'settings', component: AdminSettingsComponent },
      { path: 'fraud', component: AdminFraudComponent },
      { path: 'notifications', component: AdminNotificationsComponent },

      // Placeholders
      { path: 'jobs-trends', component: AdminHomeComponent },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];
