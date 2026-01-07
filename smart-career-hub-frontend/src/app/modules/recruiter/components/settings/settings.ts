import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecruiterService } from '../../services/recruiter.service';
import { AuthService } from '../../../shared/services/auth';

@Component({
    selector: 'app-recruiter-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './settings.html',
    styleUrls: ['./settings.css']
})
export class RecruiterSettingsComponent {
    passwordData = {
        currentPassword: '',
        newPassword: ''
    };

    isLoading = false;

    constructor(
        private authService: AuthService,
        private recruiterService: RecruiterService
    ) { }

    changePassword() {
        if (!this.passwordData.currentPassword || !this.passwordData.newPassword) {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        if (this.passwordData.newPassword.length < 6) {
            alert('Le nouveau mot de passe doit contenir au moins 6 caractères.');
            return;
        }

        this.isLoading = true;
        this.authService.currentUser$.subscribe(user => {
            if (user && user.id) {
                this.recruiterService.updatePassword(Number(user.id), this.passwordData).subscribe({
                    next: () => {
                        alert('Mot de passe mis à jour avec succès !');
                        this.passwordData = { currentPassword: '', newPassword: '' };
                        this.isLoading = false;
                    },
                    error: (err) => {
                        console.error('Error updating password:', err);
                        alert(err.error?.message || 'Erreur lors du changement de mot de passe.');
                        this.isLoading = false;
                    }
                });
            }
        });
    }
}
