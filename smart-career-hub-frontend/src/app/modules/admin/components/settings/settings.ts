import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './settings.html',
    styleUrls: ['./settings.css']
})
export class AdminSettingsComponent {



    settings = {
        general: {
            maintenanceMode: false,
            platformName: 'Smart Career Hub',
            supportEmail: 'support@smartcareer.hub',
            defaultLanguage: 'fr'
        },
        security: {
            require2FA: true,
            sessionTimeout: 30,
            passwordPolicy: {
                uppercase: true,
                number: true,
                specialChar: true
            }
        },
        notifications: {
            emailFraudAlert: true,
            emailNewAdmin: true,
            emailWeeklyReport: false
        },
        ai: {
            matchingThreshold: 75,
            fraudSensitivity: 60,
            autoBanHighRisk: false
        }
    };

    saveAll() {
        // Here you would call an API service to persist the settings
        console.log('Settings Saved', this.settings);

        // Simple alert for feedback (in production use a toast)
        alert('Modifications enregistrées avec succès !');
    }
}
