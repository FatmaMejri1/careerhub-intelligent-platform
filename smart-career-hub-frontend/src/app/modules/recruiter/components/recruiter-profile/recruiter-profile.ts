import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecruiterProfileService } from '../../services/recruiter-profile.service';

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

    // Expanded Recruiter model matching candidate style
    user = {
        firstName: 'Ahmed',
        lastName: 'Salah',
        role: 'Talent Acquisition Manager',
        email: 'ahmed.salah@techsolutions.com',
        phone: '+216 22 333 444',
        address: 'Tunis, Tunisia',
        companyName: 'Tech Solutions Inc.',
        website: 'www.techsolutions.com',
        bio: 'Passionné par le recrutement de talents dans le secteur technologique. Toujours à la recherche de profils innovants et passionnés par le développement.',

        // Social Links
        socials: {
            linkedin: 'https://linkedin.com/in/ahmedsalah',
            twitter: 'https://twitter.com/ahmedsalah',
            company: 'https://techsolutions.com'
        },

        // Recruiting specialities
        specialities: ['Java/Spring Boot', 'Angular', 'DevOps', 'Cloud Architecture', 'Product Management']
    };

    originalData: any;

    constructor(private profileService: RecruiterProfileService) { }

    ngOnInit() {
        this.originalData = JSON.parse(JSON.stringify(this.user));
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
        this.user = JSON.parse(JSON.stringify(this.originalData));
    }

    saveProfile() {
        this.isEditing = false;
        this.originalData = JSON.parse(JSON.stringify(this.user));
        // Logic to save to backend
        alert('Profil mis à jour avec succès !');
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
