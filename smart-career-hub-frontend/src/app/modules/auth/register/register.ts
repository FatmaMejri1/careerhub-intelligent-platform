import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  userRole: 'candidate' | 'recruiter' = 'candidate';

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
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.fb.group({});
  }

  ngOnInit(): void {
    // Get role from route parameter
    this.route.params.subscribe(params => {
      this.userRole = params['role'] || 'candidate';
      this.buildForm();
    });
  }

  private buildForm(): void {
    if (this.userRole === 'recruiter') {
      this.registerForm = this.fb.group({
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required]],
        companyName: ['', [Validators.required]],
        jobTitle: ['', [Validators.required]],
        website: [''],
        companyAddress: [''],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
      }, { validators: this.passwordsMatchValidator });
    } else {
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

      const registerData: any = {
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        password: formData.password,
        role: this.userRole
      };

      if (this.userRole === 'recruiter') {
        registerData.companyName = formData.companyName;
        registerData.jobTitle = formData.jobTitle;
        registerData.website = formData.website;
        registerData.companyAddress = formData.companyAddress;
      } else {
        registerData.objective = formData.objective;
        registerData.interests = formData.interests;
        registerData.experience = formData.experience;
      }

      this.authService.register(registerData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response && (response.token || response.id)) {
            const targetRoute = this.userRole === 'recruiter' ? '/recruiter' : '/candidate';
            this.router.navigate([targetRoute]);
          } else {
            this.errorMessage = 'Inscription réussie mais réponse inattendue.';
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
