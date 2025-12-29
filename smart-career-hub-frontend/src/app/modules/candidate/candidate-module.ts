import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CandidateDashboardComponent } from './dashboard/dashboard';
import { candidateRoutes } from './candidate-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(candidateRoutes),
    CandidateDashboardComponent
  ]
})
export class CandidateModule { }

