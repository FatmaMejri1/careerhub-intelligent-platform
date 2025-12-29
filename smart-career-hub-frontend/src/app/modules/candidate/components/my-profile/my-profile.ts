import { Component } from '@angular/core';
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

  constructor(private candidateDataService: CandidateDataService) {
    this.userPhoto$ = this.candidateDataService.userPhoto$;
  }

  isEditing = false; // Toggle for edit mode

  // Expanded user model
  user = {
    firstName: 'Fatma',
    lastName: 'Mejri', // Assuming surname
    role: 'Ingénieur Logiciel Junior',
    email: 'fatma@example.com',
    phone: '+216 55 123 456',
    address: 'Tunis, Tunisia',
    bio: 'Développeuse passionnée à la recherche de nouvelles opportunités. Expérimentée dans la création d\'applications web évolutives.',

    // Social Links
    socials: {
      linkedin: 'https://linkedin.com/in/fatma',
      github: 'https://github.com/fatma',
      portfolio: 'https://fatma.dev'
    },

    // Password Section (Mock)
    password: {
      current: '',
      new: '',
      confirm: ''
    },

    // Skills
    skills: ['Angular', 'TypeScript', 'Node.js', 'Python', 'UI/UX Design', 'SQL'],

    // Experience
    experience: [
      {
        title: 'Stagiaire Développeur Frontend',
        company: 'Tech Solutions',
        period: 'Jan 2024 - Juin 2024',
        description: 'Développement d\'interfaces web réactives avec Angular et Tailwind CSS.',
        logo: 'https://cdn-icons-png.flaticon.com/512/281/281764.png'
      }
    ],

    // Education
    education: [
      {
        degree: 'Master en Ingénierie Logicielle',
        school: 'Institut Supérieur d\'Informatique',
        period: '2022 - 2024',
        description: 'Spécialisation dans les architectures web modernes et l\'IA.'
      }
    ],

    // Academic Projects
    projects: [
      {
        name: 'Smart Career Hub',
        description: 'Une plateforme d\'orientation professionnelle alimentée par l\'IA utilisant Angular et Python.',
        link: 'https://github.com/fatma/smart-career',
        image: 'https://img.freepik.com/free-vector/job-search-concept-with-person-looking-through-magnifying-glass_23-2148498293.jpg'
      }
    ],

    // Certifications
    certifications: [
      {
        name: 'Développeur Angular Certifié',
        issuer: 'Google',
        date: '2023',
        credlyLink: 'https://www.credly.com/earner/earned/badge/...'
      }
    ]
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

  saveProfile() {
    this.isEditing = false;
    // Logic to save to backend would go here
    console.log('Profile Saved', this.user);
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photo = e.target?.result || null;
        this.candidateDataService.updatePhoto(photo);
      };
      reader.readAsDataURL(file);
    }
  }
}
