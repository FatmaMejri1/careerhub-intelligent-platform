import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const currentUser = authService.getCurrentUser();

    if (authService.isAuthenticated() && currentUser?.role === 'admin') {
        return true;
    }

    // Redirect to login if not authenticated or not admin
    // Optionally redirect to candidate dashboard if logged in but not admin
    if (authService.isAuthenticated()) {
        router.navigate(['/candidate/dashboard']);
    } else {
        router.navigate(['/auth/login']);
    }

    return false;
};
