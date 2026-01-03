import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { ForgotPasswordComponent } from './forgot-password/forgot-password';
import { RoleSelectionComponent } from './role-selection/role-selection';

@NgModule({
  imports: [
    CommonModule,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    RoleSelectionComponent,
    RouterModule.forChild([
      { path: 'login', component: LoginComponent },
      { path: 'role-selection', component: RoleSelectionComponent },
      { path: 'register/:role', component: RegisterComponent },
      { path: 'register', redirectTo: 'role-selection', pathMatch: 'full' },
      { path: 'forgot-password', component: ForgotPasswordComponent }
    ])
  ]
})
export class AuthModule { }
