import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container fade-in">
      <h2 class="mb-4">Paramètres du Compte</h2>

      <div class="settings-card">
        <h3>Notifications</h3>
        <div class="setting-item">
          <label class="switch">
            <input type="checkbox" [(ngModel)]="settings.emailNotifications">
            <span class="slider round"></span>
          </label>
          <span>Notifications par Email</span>
        </div>
        <div class="setting-item">
          <label class="switch">
            <input type="checkbox" [(ngModel)]="settings.pushNotifications">
            <span class="slider round"></span>
          </label>
          <span>Notifications Push (Alertes Emploi)</span>
        </div>
      </div>

      <div class="settings-card">
        <h3>Confidentialité</h3>
        <div class="setting-item">
          <label class="switch">
            <input type="checkbox" [(ngModel)]="settings.publicProfile">
            <span class="slider round"></span>
          </label>
          <span>Rendre le Profil Public</span>
        </div>
        <div class="setting-item">
          <label class="switch">
            <input type="checkbox" [(ngModel)]="settings.showStatus">
            <span class="slider round"></span>
          </label>
          <span>Afficher le Statut "À l'écoute"</span>
        </div>
      </div>

      <div class="settings-card danger-zone">
        <h3>Zone de Danger</h3>
        <p class="text-muted">Une fois votre compte supprimé, il n'y a pas de retour en arrière. Soyez certain de votre choix.</p>
        <button class="btn-delete" (click)="deleteAccount()">Supprimer le Compte</button>
      </div>
    </div>
  `,
  styles: [`
    .settings-container { padding: 20px; max-width: 800px; margin: 0 auto; }
    .settings-card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 25px; }
    h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 20px; color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    .setting-item { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; font-size: 1rem; color: #555; }
    
    /* Toggle Switch */
    .switch { position: relative; display: inline-block; width: 50px; height: 26px; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
    .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
    input:checked + .slider { background-color: #4CAF50; }
    input:checked + .slider:before { transform: translateX(24px); }

    .danger-zone { border: 1px solid #ffcccc; background: #fff5f5; }
    .danger-zone h3 { color: #d9534f; border-color: #ffcccc; }
    .btn-delete { background-color: #d9534f; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.3s; }
    .btn-delete:hover { background-color: #c9302c; }
  `]
})
export class SettingsComponent {
  settings = {
    emailNotifications: true,
    pushNotifications: false,
    publicProfile: true,
    showStatus: true
  };

  deleteAccount() {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      console.log('Account deleted');
    }
  }
}
