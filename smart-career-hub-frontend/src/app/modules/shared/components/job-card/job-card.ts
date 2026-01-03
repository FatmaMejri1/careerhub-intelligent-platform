// src/app/modules/shared/components/job-card/job-card.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="job-card">
      <div class="card-header">
        <div class="header-main">
          <h3>{{job.title}}</h3>
          <span class="internal-badge" *ngIf="isInternalJob()">
            <i class="bi bi-lightning-fill"></i> Platform
          </span>
        </div>
        <div class="time-badge">Latest post about {{getTimeAgo()}} ago</div>
      </div>
      
      <div class="card-body">
        <h4 class="company-name">{{job.company}}</h4>
        <div class="location">
          <i class="bi bi-geo-alt"></i> {{job.location}}
        </div>
        
        <div class="source-info" *ngIf="job.url && !isInternalJob()">
          <span class="label">Scraped from</span>
          <a [href]="job.url" target="_blank" class="source-link">{{getDomain(job.url)}}</a>
        </div>
        <div class="source-info" *ngIf="isInternalJob()">
          <span class="label">Internal Position</span>
          <span class="internal-info"><i class="bi bi-shield-check"></i> Direct Application</span>
        </div>
      </div>

      <div class="card-footer">
        <div class="posted-date">
          <i class="bi bi-calendar"></i> Posted: {{formatDate(job.postedDate)}}
        </div>
        <div class="action-buttons">
          <button class="btn-view" (click)="handleDetailsRequest('view')">
            {{ isInternalJob() ? 'View & Apply' : 'View Details' }}
          </button>
          <button class="btn-apply" (click)="handleDetailsRequest('apply')" [disabled]="hasApplied" *ngIf="!isInternalJob()">
            <span *ngIf="!hasApplied && isLoggedIn">Apply Now</span>
            <span *ngIf="hasApplied">Applied ✓</span>
            <span *ngIf="!isLoggedIn">Sign in to Apply <i class="bi bi-lock-fill"></i></span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .job-card {
      background: white;
      border-radius: 8px;
      padding: 24px;
      border: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      height: 100%;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      transition: box-shadow 0.2s;
    }
    .job-card:hover {
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
    }
    
    .card-header {
      margin-bottom: 16px;
    }
    
    h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 8px 0;
      line-height: 1.4;
    }
    
    .time-badge {
      font-size: 0.875rem;
      color: #374151;
      font-weight: 500;
    }
    
    .card-body {
      flex: 1;
      margin-bottom: 24px;
    }
    
    .company-name {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 8px 0;
      line-height: 1.4;
    }
    
    .location {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .source-info {
      font-size: 0.875rem;
    }
    
    .source-info .label {
      display: block;
      color: #6b7280;
      margin-bottom: 2px;
    }
    
    .source-link {
      color: #6b7280;
      text-decoration: none;
    }
    
    .source-link:hover {
      text-decoration: underline;
    }
    
    .card-footer {
      border-top: 1px solid #e5e7eb;
      padding-top: 16px;
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    
    .posted-date {
      font-size: 0.875rem;
      color: #6b7280;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }
    
    .btn-view, .btn-apply {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 36px;
        white-space: nowrap;
    }

    .btn-view {
      background-color: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      padding: 0 16px;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-view:hover {
      background-color: #e5e7eb;
    }
    
    .btn-apply {
      background-color: #3b82f6;
      color: white;
      border: none;
      padding: 0 16px;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .btn-apply:hover:not(:disabled) {
      background-color: #2563eb;
    }
    
    .btn-apply:disabled {
      background-color: #10b981;
      cursor: not-allowed;
    }
    .header-main {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 4px;
    }

    .internal-badge {
      background: #ecfdf5;
      color: #059669;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
      border: 1px solid #d1fae5;
    }

    .internal-info {
        color: #059669;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;
    }
  `]
})
export class JobCardComponent implements OnInit {
  @Input() job: any;
  @Output() apply = new EventEmitter<string | number>();
  @Output() showDetails = new EventEmitter<{ job: any, mode: 'view' | 'apply' }>();

  private timeAgoValue: string = '';
  isLoggedIn = false;
  hasApplied = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.timeAgoValue = this.calculateTimeAgo();
    this.isLoggedIn = this.authService.isAuthenticated();
    this.checkIfApplied();
  }

  isInternalJob(): boolean {
    return this.job && (this.job.isInternal || (this.job.id && this.job.id.toString().startsWith('internal-')));
  }

  checkIfApplied(): void {
    const applications = localStorage.getItem('user_applications');
    if (applications) {
      const apps = JSON.parse(applications);
      this.hasApplied = apps.some((app: any) => app.jobId === this.job.id);
    }
  }

  handleDetailsRequest(mode: 'view' | 'apply'): void {
    if (mode === 'apply' && !this.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.showDetails.emit({ job: this.job, mode });
  }

  // Helpers
  getDomain(url: string): string {
    if (!url) return '';
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }

  formatDate(date: string | Date): string {
    if (!date) return 'Recently';
    return new Date(date).toLocaleDateString('en-GB');
  }

  getTimeAgo(): string {
    return this.timeAgoValue;
  }

  private calculateTimeAgo(): string {
    if (this.job?.postedDate) {
      const posted = new Date(this.job.postedDate);
      const now = new Date();
      const diffMs = now.getTime() - posted.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
      } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
      } else {
        return 'less than 1 hour';
      }
    }
    const hours = ((this.job?.id?.charCodeAt?.(0) || 1) % 24) + 1;
    return `${hours} hours`;
  }
}
