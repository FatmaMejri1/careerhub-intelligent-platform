import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { recruiterRoutes } from './recruiter-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(recruiterRoutes)
  ]
})
export class RecruiterModule { }
