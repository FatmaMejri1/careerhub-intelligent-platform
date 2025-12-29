import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          // Mock mode: toujours réussir la connexion
          if (response.user && response.token) {
            this.authService.setUser(response.user, response.token);
            // Redirect based on user role
            this.redirectUser(response.user.role);
          } else {
            // Fallback pour le mode mock
            const mockUser = {
              id: '1',
              email: email,
              name: email.split('@')[0],
              role: 'candidate' as const
            };
            this.authService.setUser(mockUser, 'mock-token');
            this.redirectUser('candidate');
          }
        },
        error: (error) => {
          this.isLoading = false;
          // En mode mock, on ne devrait jamais arriver ici
          // Mais on garde la gestion d'erreur pour plus tard
          this.errorMessage = error.error?.message || 'Erreur de connexion. Veuillez réessayer.';
        }
      });
    }
  }

  private redirectUser(role: string): void {
    switch (role) {
      case 'candidate':
        this.router.navigate(['/candidate/dashboard']);
        break;
      case 'recruiter':
        this.router.navigate(['/recruiter']);
        break;
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      default:
        this.router.navigate(['/auth/login']);
    }
  }
}

