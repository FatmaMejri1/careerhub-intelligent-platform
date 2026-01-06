import { Component, OnInit } from '@angular/core';
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

    constructor(private profileService: AdminProfileService) {
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
                    this.profileImage = data.profileImage;
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
            next: () => {
                this.isEditing = false;
                alert('Profil mis à jour avec succès !');
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
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.profileImage = e.target.result;
                this.profileService.updateProfileImage(this.profileImage!);
            };
            reader.readAsDataURL(file);
        }
    }
}
