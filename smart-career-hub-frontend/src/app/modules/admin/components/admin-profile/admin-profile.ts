import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminProfileService } from '../../services/admin-profile.service';
import { AuthService } from '../../../shared/services/auth';

@Component({
    selector: 'app-admin-profile',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-profile.html',
    styleUrls: ['./admin-profile.css']
})
export class AdminProfileComponent implements OnInit {
    isEditing = false;
    profileImage: string | null = null;

    adminData: any = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'Administrateur Système'
    };

    constructor(
        private profileService: AdminProfileService,
        private authService: AuthService
    ) {
        this.profileService.profileImage$.subscribe(img => {
            if (img) this.profileImage = img;
        });
    }

    ngOnInit(): void {
        this.loadProfile();
    }

    loadProfile(): void {
        this.profileService.getProfile().subscribe(data => {
            if (data) {
                this.adminData = {
                    ...this.adminData,
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || ''
                };
                if (data.profileImage) {
                    let img = data.profileImage;
                    if (!img.startsWith('http') && !img.startsWith('data:')) {
                        img = `http://localhost:9099${img}`;
                    }
                    this.profileImage = img;
                }
            }
        });
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
    }

    saveProfile() {
        const { role, ...rest } = this.adminData;
        const payload = {
            ...rest,
            profileImage: this.profileImage
        };
        this.profileService.updateProfile(payload).subscribe({
            next: (updatedAdmin) => {
                this.isEditing = false;
                alert('Profil mis à jour avec succès !');

                // Update AuthService cached user to sync sidebar name
                const currentUser = this.authService.getCurrentUser();
                if (currentUser) {
                    this.authService.updateUser({
                        ...currentUser,
                        name: `${updatedAdmin.firstName} ${updatedAdmin.lastName}`
                    });
                }

                this.loadProfile();
            },
            error: (err) => {
                console.error('Error saving profile', err);
                alert('Erreur lors de la mise à jour du profil.');
            }
        });
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            // Upload directly
            this.profileService.uploadPhoto(file).subscribe({
                next: (response) => {
                    if (response && response.url) {
                        // Construct full URL since it's a static resource from backend
                        const fullUrl = `http://localhost:9099${response.url}`;
                        this.profileImage = fullUrl;
                        this.profileService.updateProfileImage(fullUrl);
                        // Also update adminData to ensure it syncs if we save later
                        // (Though updateProfile might overwrite it with string? 
                        // Backend updateProfile updates profileImage if not null. 
                        // If we save now, we send fullUrl string. Backend saves it. Correct.)
                    }
                },
                error: (error) => {
                    console.error('Error uploading photo:', error);
                    alert('Erreur lors du téléchargement de la photo.');
                }
            });
        }
    }
}
