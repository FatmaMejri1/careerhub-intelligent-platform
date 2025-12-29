import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-recruiter-analytics',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './analytics.html',
    styleUrls: ['./analytics.css']
})
export class RecruiterAnalyticsComponent {
    selectedPeriod = 'month';
}
