import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CandidateDataService } from '../../services/candidate-data.service';

@Component({
  selector: 'app-my-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile {
  userPhoto$;

  constructor(
    private candidateDataService: CandidateDataService,
    private cdr: ChangeDetectorRef
  ) {
    this.userPhoto$ = this.candidateDataService.userPhoto$;
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.candidateDataService.getProfile().subscribe({
      next: (data) => {
        if (data) {
          console.log('Received profile data:', data); // Debug logging

          this.user.firstName = data.prenom || '';
          this.user.lastName = data.nom || '';
          this.user.email = data.email || '';
          this.user.phone = data.telephone || '';
          this.user.role = data.titre || 'Chercheur d\'emploi';
          this.user.address = data.adresse || '';
          this.user.bio = data.objectif || ''; // Using objectif as bio

          // Socials
          this.user.socials.linkedin = data.linkedin || 'https://linkedin.com/in/';
          this.user.socials.github = data.github || 'https://github.com/';
          this.user.socials.portfolio = data.portfolio || '';

          // Generic JSON parser
          const parseJson = (str: string) => {
            if (!str || str === 'null') return [];
            try { return JSON.parse(str); } catch (e) {
              console.warn('JSON Parse Error for:', str); return [];
            }
          };

          this.user.skills = parseJson(data.competences);
          this.user.experience = parseJson(data.experiences);
          this.user.education = parseJson(data.educations);
          this.user.projects = parseJson(data.projects);
          this.user.certifications = parseJson(data.certifications);

          if (data.photoUrl) {
            this.candidateDataService.updatePhoto(data.photoUrl);
          }

          this.cdr.detectChanges(); // Force UI update
        }
      },
      error: (err) => console.error('Failed to load profile', err)
    });
  }

  isEditing = false; // Toggle for edit mode

  // Expanded user model
  user = {
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    phone: '',
    address: '',
    bio: '',

    // Social Links
    socials: {
      linkedin: 'https://linkedin.com/in/',
      github: 'https://github.com/',
      portfolio: ''
    },

    // Password Section (Mock)
    password: {
      current: '',
      new: '',
      confirm: ''
    },

    // Skills
    skills: [] as string[],

    // Experience
    experience: [] as any[],

    // Education
    education: [] as any[],

    // Academic Projects
    projects: [] as any[],

    // Certifications
    certifications: [] as any[]
  };

  newSkill = '';

  addSkill() {
    if (this.newSkill.trim()) {
      this.user.skills.push(this.newSkill.trim());
      this.newSkill = '';
    }
  }

  removeSkill(index: number) {
    this.user.skills.splice(index, 1);
  }

  addEducation() {
    this.user.education.push({ degree: '', school: '', period: '', description: '' });
  }

  removeEducation(index: number) {
    this.user.education.splice(index, 1);
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  addExperience() {
    this.user.experience.push({ title: '', company: '', period: '', description: '', logo: '' });
  }

  removeExperience(index: number) {
    this.user.experience.splice(index, 1);
  }

  addProject() {
    this.user.projects.push({ name: '', description: '', link: '', image: '' });
  }

  removeProject(index: number) {
    this.user.projects.splice(index, 1);
  }

  addCertification() {
    this.user.certifications.push({ name: '', issuer: '', date: '', credlyLink: '' });
  }

  removeCertification(index: number) {
    this.user.certifications.splice(index, 1);
  }

  calculateCompletionStatus(): number {
    let score = 0;
    const totalWeight = 100;

    // Weighted criteria
    if (this.user.firstName && this.user.lastName) score += 10;
    if (this.user.role) score += 5;
    if (this.user.bio) score += 10;
    if (this.user.address) score += 5;
    if (this.user.phone) score += 5;

    if (this.user.skills && this.user.skills.length > 0) score += 15;
    if (this.user.experience && this.user.experience.length > 0) score += 15;
    if (this.user.education && this.user.education.length > 0) score += 15;
    if (this.user.projects && this.user.projects.length > 0) score += 10;
    if (this.user.certifications && this.user.certifications.length > 0) score += 10;

    return Math.min(score, 100);
  }

  get completionPercentage(): number {
    return this.calculateCompletionStatus();
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photo = e.target?.result as string;
        this.candidateDataService.updatePhoto(photo);
        // Also update local user object so it binds immediately if needed
        // But actual upload happens on Save Profile
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    this.isEditing = false;

    let currentPhoto = '';
    this.userPhoto$.subscribe(p => {
      if (typeof p === 'string') {
        currentPhoto = p;
      } else {
        currentPhoto = '';
      }
    }).unsubscribe();

    const payload = {
      prenom: this.user.firstName,
      nom: this.user.lastName,
      telephone: this.user.phone,
      titre: this.user.role,
      adresse: this.user.address,
      objectif: this.user.bio,
      photoUrl: currentPhoto, // Send the Photo URL (Base64)

      linkedin: this.user.socials.linkedin,
      github: this.user.socials.github,
      portfolio: this.user.socials.portfolio,

      competences: JSON.stringify(this.user.skills),
      experiences: JSON.stringify(this.user.experience),
      educations: JSON.stringify(this.user.education),
      projects: JSON.stringify(this.user.projects),
      certifications: JSON.stringify(this.user.certifications)
    };

    console.log('Saving payload:', payload);

    this.candidateDataService.updateProfile(payload).subscribe({
      next: (res) => {
        console.log('Profile updated', res);
        this.loadProfile();
      },
      error: (err) => console.error('Error updating profile', err)
    });
  }
}
