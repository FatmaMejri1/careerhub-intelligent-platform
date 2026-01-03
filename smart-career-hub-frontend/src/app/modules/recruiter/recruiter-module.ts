import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { recruiterRoutes } from './recruiter-routing.module';
import { RecruiterProfileComponent } from './components/recruiter-profile/recruiter-profile';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(recruiterRoutes),
    // Si ton composant est standalone, tu peux l'importer directement ici
    RecruiterProfileComponent
  ],
  // Déclarations inutiles si composant standalone
  // declarations: [RecruiterProfileComponent] 
})
export class RecruiterModule { }
