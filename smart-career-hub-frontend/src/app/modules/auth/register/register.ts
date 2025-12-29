import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  interestOptions: string[] = [
    'Développement Web',
    'DevOps',
    'Cloud',
    'Data & IA',
    'Cybersécurité',
    'Product Management',
    'UX / UI Design'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      objective: ['', [Validators.required]], // job, club, internship
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      interests: [[]],
      experience: ['']
    }, { validators: this.passwordsMatchValidator });
  }

  private passwordsMatchValidator(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass && confirm && pass !== confirm ? { passwordMismatch: true } : null;
  }

  get passwordMismatch(): boolean {
    const touched = this.registerForm.get('confirmPassword')?.touched === true;
    return this.registerForm.hasError('passwordMismatch') && touched;
  }

  onInterestChange(checked: boolean, interest: string): void {
    const current = this.registerForm.value.interests ?? [];
    const next = checked
      ? [...current, interest]
      : current.filter((i: string) => i !== interest);
    this.registerForm.patchValue({ interests: next });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = this.registerForm.value;
      
      // Préparer les données pour l'inscription
      const registerData = {
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        objective: formData.objective,
        interests: formData.interests,
        experience: formData.experience,
        password: formData.password
      };

      this.authService.register(registerData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.user && response.token) {
            this.authService.setUser(response.user, response.token);
            // Rediriger vers le dashboard candidat
            this.router.navigate(['/candidate']);
          } else {
            // Fallback pour le mode mock
            const mockUser = {
              id: '1',
              email: formData.email,
              name: formData.fullName,
              role: 'candidate' as const
            };
            this.authService.setUser(mockUser, 'mock-token');
            this.router.navigate(['/candidate']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Erreur lors de l\'inscription. Veuillez réessayer.';
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
