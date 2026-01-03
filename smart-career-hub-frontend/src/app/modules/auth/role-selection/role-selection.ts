import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-role-selection',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './role-selection.html',
    styleUrls: ['./role-selection.css']
})
export class RoleSelectionComponent {
    constructor(private router: Router) { }

    selectRole(role: 'candidate' | 'recruiter'): void {
        this.router.navigate(['/auth/register', role]);
    }
}
