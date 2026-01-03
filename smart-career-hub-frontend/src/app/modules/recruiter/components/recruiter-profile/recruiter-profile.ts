import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecruiterProfileService } from '../../services/recruiter-profile.service';
import { Recruiter } from '../../services/recruiter.service';
import { AuthService, User } from '../../../shared/services/auth';

@Component({
    selector: 'app-recruiter-profile',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './recruiter-profile.html',
    styleUrls: ['./recruiter-profile.css']
})
export class RecruiterProfileComponent implements OnInit {
    isEditing = false;
    profileImage: string | null = null;
    newSkill = '';

    // Initialize with empty structure to avoid template errors before load
    user: any = {
        firstName: '',
        lastName: '',
        role: '',
        email: '',
        phone: '',
        address: '',
        companyName: '',
        website: '',
        bio: '',
        socials: {
            linkedin: '',
            twitter: '',
            company: ''
        },
        specialities: []
    };

    originalData: any;
    currentRecruiterId?: number;

    constructor(
        private profileService: RecruiterProfileService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.profileService.profile$.subscribe(profile => {
            if (profile) {
                this.currentRecruiterId = profile.id;
                this.user = {
                    firstName: profile.prenom,
                    lastName: profile.nom,
                    role: profile.poste || '',
                    email: profile.email,
                    phone: profile.telephone || '',
                    address: profile.adresseEntreprise || '',
                    companyName: profile.nomEntreprise || '',
                    website: profile.siteWeb || '',
                    bio: profile.descriptionEntreprise || '',
                    socials: {
                        linkedin: profile.linkedin || '',
                        twitter: profile.twitter || '',
                        company: profile.siteWeb || ''
                    },
                    specialities: profile.specialities || []
                };
                this.originalData = JSON.parse(JSON.stringify(this.user));
            }
        });

        this.profileService.profileImage$.subscribe(img => {
            this.profileImage = img || null;
        });
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        if (!this.isEditing) {
            this.cancelEdit();
        }
    }

    cancelEdit() {
        this.isEditing = false;
        if (this.originalData) {
            this.user = JSON.parse(JSON.stringify(this.originalData));
        }
    }

    saveProfile() {
        if (!this.currentRecruiterId) return;

        const updatedRecruiter: Recruiter = {
            id: this.currentRecruiterId,
            nom: this.user.lastName,
            prenom: this.user.firstName,
            email: this.user.email,
            telephone: this.user.phone,
            poste: this.user.role,
            nomEntreprise: this.user.companyName,
            siteWeb: this.user.website,
            descriptionEntreprise: this.user.bio,
            adresseEntreprise: this.user.address,
            linkedin: this.user.socials.linkedin,
            twitter: this.user.socials.twitter,
            specialities: this.user.specialities,
            photoUrl: this.profileImage || undefined
        };

        this.profileService.updateProfile(updatedRecruiter).subscribe({
            next: () => {
                this.isEditing = false;
                this.originalData = JSON.parse(JSON.stringify(this.user));

                // Update local auth state to reflect potential changes
                const currentUser = this.authService.getCurrentUser();
                if (currentUser) {
                    this.authService.updateUser({
                        ...currentUser,
                        name: this.user.fullName
                    });
                }

                alert('Profil mis à jour avec succès !');
            },
            error: (err) => {
                console.error('Error saving profile', err);

                // If update fails with 404, it means we need to PROMOTE the user
                if (err.status === 404 && this.currentRecruiterId) {
                    this.profileService.promoteProfile(this.currentRecruiterId, updatedRecruiter).subscribe({
                        next: (newProfile) => {
                            this.isEditing = false;
                            this.originalData = JSON.parse(JSON.stringify(this.user));

                            // CRITICAL: Update role to recruiter in auth state
                            const currentUser = this.authService.getCurrentUser();
                            if (currentUser) {
                                this.authService.updateUser({
                                    ...currentUser,
                                    role: 'recruiter',
                                    name: this.user.fullName
                                });
                            }

                            alert('Profil créé avec succès (Promotion) !');
                        },
                        error: (createErr) => {
                            console.error('Error promoting profile', createErr);
                            alert("Erreur critique: Impossible de créer le profil recruteur.");
                        }
                    });

                } else {
                    alert('Erreur lors de la mise à jour du profil.');
                }
            }
        });
    }

    onFileSelected(event: any) {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const img = e.target.result;
                this.profileImage = img;
                this.profileService.updateProfileImage(img);
            };
            reader.readAsDataURL(file);
        }
    }

    deletePhoto() {
        this.profileImage = null;
        this.profileService.updateProfileImage('');
    }

    addSpeciality() {
        if (this.newSkill.trim()) {
            this.user.specialities.push(this.newSkill.trim());
            this.newSkill = '';
        }
    }

    removeSpeciality(index: number) {
        this.user.specialities.splice(index, 1);
    }
}
