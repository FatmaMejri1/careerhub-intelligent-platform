import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-home.html',
    styleUrls: ['./admin-home.css']
})
export class AdminHomeComponent {

    fraudAlerts = [
        { user: 'John Doe', role: 'Candidate', type: 'Faux Diplôme', score: 88 },
        { user: 'Tech Corp LLC', role: 'Recruiter', type: 'Offre Suspecte', score: 75 },
        { user: 'Sam Smith', role: 'Candidate', type: 'Incohérence CV', score: 62 },
        { user: 'Global HR', role: 'Recruiter', type: 'Spam Massif', score: 95 }
    ];

}
