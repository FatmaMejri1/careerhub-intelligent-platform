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

    passwords = {
        current: '',
        new: '',
        confirm: ''
    };

    updatePassword() {
        if (this.passwords.new !== this.passwords.confirm) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }

        // Logic to call API would go here
        console.log('Password Update Triggered');

        alert('Votre mot de passe a été mis à jour avec succès !');

        // Clear form
        this.passwords = {
            current: '',
            new: '',
            confirm: ''
        };
    }
}
