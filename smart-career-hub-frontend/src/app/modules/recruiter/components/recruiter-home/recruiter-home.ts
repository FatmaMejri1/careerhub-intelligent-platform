import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-recruiter-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './recruiter-home.html',
    styleUrls: ['./recruiter-home.css']
})
export class RecruiterHomeComponent {

    recentApplications = [
        { name: 'Amine Ben Ali', initials: 'AB', position: 'Développeur Angular', experience: '3 ans', matchScore: 92, time: '2h' },
        { name: 'Sarah M.', initials: 'SM', position: 'UX Designer', experience: '5 ans', matchScore: 88, time: '5h' },
        { name: 'Karim Jaziri', initials: 'KJ', position: 'Product Owner', experience: '4 ans', matchScore: 76, time: '1j' },
        { name: 'Leila Tounsi', initials: 'LT', position: 'Développeur Angular', experience: '2 ans', matchScore: 95, time: '1j' }
    ];

    recommendations = [
        { role: 'Senior Java Dev', candidateName: 'Youssef K.', match: 94, skills: 'Java, Spring Boot, Microservices' },
        { role: 'UX Designer', candidateName: 'Nour E.', match: 89, skills: 'Figma, Adobe XD, Prototyping' }
    ];
}
