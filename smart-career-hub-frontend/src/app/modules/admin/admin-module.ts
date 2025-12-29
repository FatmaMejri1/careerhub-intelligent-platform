import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { adminRoutes } from './admin-routing-module';
import { AdminDashboardComponent } from './dashboard/dashboard';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminRoutes),
    AdminDashboardComponent
  ]
})
export class AdminModule { }
