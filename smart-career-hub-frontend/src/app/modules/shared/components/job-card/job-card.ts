// src/app/modules/shared/components/job-card/job-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="job-card">
      <div class="job-header">
        <div class="company-logo">{{job.logo}}</div>
        <div class="job-info">
          <div class="match-badge" [ngClass]="getMatchClass()">
            {{job.match}}% match
          </div>
          <h3>{{job.title}}</h3>
          <p class="company">{{job.company}}</p>
          <div class="job-details">
            <span class="location">📍 {{job.location}}</span>
            <span class="salary">💰 {{job.salary}}</span>
          </div>
        </div>
      </div>

      <div class="job-badges">
        <span *ngFor="let badge of job.badges" class="badge">
          {{badge}}
        </span>
      </div>

      <div class="job-actions">
        <button class="btn-apply" (click)="onApply()">
          Postuler
        </button>
        <button class="btn-save">
          💾 Sauvegarder
        </button>
      </div>
    </div>
  `,
  styles: [`
    .job-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      border: 1px solid #e5e7eb;
      transition: all 0.3s;
    }
    .job-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    .job-header {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
    }
    .company-logo {
      font-size: 2rem;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f3f4f6;
      border-radius: 10px;
    }
    .match-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .match-high { background: #d1fae5; color: #065f46; }
    .match-medium { background: #dbeafe; color: #1e40af; }
    .match-low { background: #fef3c7; color: #92400e; }
    h3 { margin: 5px 0; font-size: 1.1rem; }
    .company { color: #6b7280; margin: 5px 0; }
    .job-details {
      display: flex;
      gap: 15px;
      color: #6b7280;
      font-size: 0.9rem;
    }
    .job-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 15px 0;
    }
    .badge {
      background: #f3f4f6;
      color: #4b5563;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
    }
    .job-actions {
      display: flex;
      gap: 10px;
    }
    .job-actions button {
      flex: 1;
      padding: 10px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 600;
    }
    .btn-apply {
      background: #3b82f6;
      color: white;
    }
    .btn-save {
      background: #f3f4f6;
      color: #4b5563;
    }
  `]
})
export class JobCardComponent {
  @Input() job: any;
  @Output() apply = new EventEmitter<number>();

  getMatchClass(): string {
    if (this.job.match >= 90) return 'match-high';
    if (this.job.match >= 80) return 'match-medium';
    return 'match-low';
  }

  onApply(): void {
    this.apply.emit(this.job.id);
  }
}
