import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-recruiter-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './settings.html',
    styleUrls: ['./settings.css']
})
export class RecruiterSettingsComponent {
    settings = {
        notifications: {
            applications: true,
            weeklyReport: false,
            marketing: true
        },
        preferences: {
            language: 'fr',
            timezone: 'TUN'
        }
    };

    saveSettings() {
        // Mock save
        alert('Vos paramètres ont été enregistrés avec succès.');
        console.log('Settings Saved:', this.settings);
    }

    changePassword() {
        alert('Demande de changement de mot de passe traitée.');
    }
}
