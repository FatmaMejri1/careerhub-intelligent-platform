import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminProfileService } from '../../services/admin-profile.service';

@Component({
    selector: 'app-admin-profile',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-profile.html',
    styleUrls: ['./admin-profile.css']
})
export class AdminProfileComponent {
    isEditing = false;
    profileImage: string | null = null;

    adminData = {
        firstName: 'Fatma',
        lastName: 'Mejri',
        email: 'admin@smartcareer.hub',
        phone: '+216 55 123 456',
        role: 'System Administrator'
    };

    constructor(private profileService: AdminProfileService) {
        this.profileService.profileImage$.subscribe(img => {
            if (img) this.profileImage = img;
        });
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
    }

    saveProfile() {
        this.isEditing = false;
        // In a real app, call API here
        alert('Profil mis à jour avec succès !');
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.profileImage = e.target.result;
                this.profileService.updateProfileImage(this.profileImage!);
            };
            reader.readAsDataURL(file);
        }
    }
}
