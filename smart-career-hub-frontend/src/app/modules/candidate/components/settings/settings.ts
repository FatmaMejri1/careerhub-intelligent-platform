import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CandidateDataService } from '../../services/candidate-data.service';
import { AuthService } from '../../../shared/services/auth';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent {
  passwordData = {
    currentPassword: '',
    newPassword: ''
  };

  isLoading = false;

  constructor(
    private authService: AuthService,
    private candidateService: CandidateDataService
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
        this.candidateService.updatePassword(Number(user.id), this.passwordData).subscribe({
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
