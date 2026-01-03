// src/app/modules/shared/components/job-details-modal/job-details-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-details-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="close()" *ngIf="isOpen">
      <div class="modal-wrapper">
        <div class="modal-content" (click)="$event.stopPropagation()">
          
          <!-- Decorative Header Banner -->
          <div class="modal-banner">
             <div class="banner-pattern"></div>
             <button class="close-btn-floating" (click)="close()">&times;</button>
          </div>

          <!-- Main Scrollable Content -->
          <div class="modal-scroll-area">
            
            <!-- Header Section with Company Logo/Initial -->
            <div class="modal-header-section">
              <div class="company-logo-placeholder">
                {{ getCompanyInitials(job.company) }}
              </div>
              <h2 class="job-title">{{job.title}}</h2>
              <p class="company-link">
                {{job.company}} 
                <span class="verified-badge" *ngIf="job.isInternal || job.url"><i class="bi bi-check-circle-fill"></i> Verified</span>
              </p>
            </div>

            <!-- Meta Data Grid -->
            <div class="meta-grid">
               <div class="meta-item">
                 <div class="meta-icon"><i class="bi bi-geo-alt-fill"></i></div>
                 <div class="meta-text">
                   <span class="label">Location</span>
                   <span class="value">{{job.location || 'Remote'}}</span>
                 </div>
               </div>
               <div class="meta-item">
                 <div class="meta-icon"><i class="bi bi-briefcase-fill"></i></div>
                 <div class="meta-text">
                   <span class="label">Type</span>
                   <span class="value">{{job.type || 'Full-time'}}</span>
                 </div>
               </div>
               <div class="meta-item">
                 <div class="meta-icon"><i class="bi bi-cash-stack"></i></div>
                 <div class="meta-text">
                   <span class="label">Salary</span>
                   <span class="value">{{job.salary || 'Not disclosed'}}</span>
                 </div>
               </div>
               <div class="meta-item">
                 <div class="meta-icon"><i class="bi bi-calendar-event"></i></div>
                 <div class="meta-text">
                   <span class="label">Posted</span>
                   <span class="value">{{ job.postedDate ? (job.postedDate | date:'mediumDate') : 'Recently' }}</span>
                 </div>
               </div>
            </div>

            <!-- Job Description -->
            <div class="section-content">
              <h3>Role Overview</h3>
              <p class="description-text">{{job.description || getDefaultDescription()}}</p>
            </div>

            <!-- Skills/Badges -->
            <div class="section-content" *ngIf="job.badges && job.badges.length > 0">
              <h3>Skills & Tech Stack</h3>
              <div class="job-badges">
                <span class="badge" *ngFor="let badge of job.badges">{{badge}}</span>
              </div>
            </div>

             <!-- Application Instructions -->
            <div class="application-timeline" *ngIf="showApplicationForm || job.isInternal">
              <h3>How to Apply</h3>
              <div class="timeline-steps">
                <div class="timeline-step">
                  <div class="marker">1</div>
                  <div class="content">
                    <h4>Prepare your Resume</h4>
                    <p>Ensure your CV highlights relevant experience for this specific role.</p>
                  </div>
                </div>
                <div class="timeline-step">
                  <div class="marker">2</div>
                  <div class="content">
                    <h4>{{ job.isInternal ? 'Confirm Application' : 'Visit Application Page' }}</h4>
                    <p>{{ job.isInternal ? 'This is an internal position. Your profile will be sent directly to the recruiter.' : 'Click the button below to be redirected to the secure application portal.' }}</p>
                  </div>
                </div>
                <!-- Source Info (External Only) -->
                <div class="timeline-info-box" *ngIf="!job.isInternal && job.url">
                   <i class="bi bi-info-circle-fill"></i>
                   <span>You will be redirected to <strong>{{getDomain(job.url)}}</strong></span>
                </div>
                <!-- Internal Badge -->
                <div class="timeline-info-box internal" *ngIf="job.isInternal">
                   <i class="bi bi-lightning-fill"></i>
                   <span>Direct application enabled via <strong>Smart Career</strong></span>
                </div>
              </div>
            </div>

          </div>

          <!-- Sticky Footer -->
          <div class="modal-footer">
            <button class="btn-cancel" (click)="close()">Close</button>
            
            <!-- External Apply -->
            <button 
              class="btn-apply" 
              (click)="goToExternalSite()"
              *ngIf="!job.isInternal && job.url">
              <span>{{getButtonText()}}</span>
              <i class="bi bi-box-arrow-up-right"></i>
            </button>

            <!-- Internal Apply -->
            <button 
              class="btn-apply internal" 
              (click)="handleInternalApply()"
              *ngIf="job.isInternal"
              [disabled]="isApplying">
              <span *ngIf="!isApplying">Apply Directly</span>
              <span *ngIf="isApplying">Applying...</span>
              <i class="bi bi-send-fill" *ngIf="!isApplying"></i>
              <div class="spinner-border spinner-border-sm" *ngIf="isApplying"></div>
            </button>

            <button 
              class="btn-disabled" 
              *ngIf="!job.isInternal && !job.url"
              disabled>
              Application Closed
            </button>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Variables fallback */
    :host {
      --primary-color: #4f46e5;
      --primary-hover: #4338ca;
      --text-main: #1f2937;
      --text-muted: #6b7280;
      --bg-white: #ffffff;
      --bg-light: #f9fafb;
      --success-color: #10b981;
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px);
      z-index: 10000;
      display: grid;
      place-items: center;
      animation: fadeIn 0.3s ease-out;
      padding: 1rem;
      overflow-y: auto;
    }

    .modal-wrapper {
      width: 100%;
      max-width: 800px;
      position: relative;
      margin: auto;
    }

    .modal-content {
      background: var(--bg-white);
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      max-height: 90vh;
      overflow: hidden;
      position: relative;
      animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Header Banner */
    .modal-banner {
      height: 140px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
      position: relative;
      flex-shrink: 0;
    }
    
    .banner-pattern {
        position: absolute;
        inset: 0;
        opacity: 0.1;
        background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0);
        background-size: 24px 24px;
    }

    .close-btn-floating {
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      font-size: 24px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(4px);
      transition: all 0.2s;
      z-index: 10;
    }
    .close-btn-floating:hover {
      background: rgba(255,255,255,0.4);
      transform: rotate(90deg);
    }

    /* Scroll Area */
    .modal-scroll-area {
      overflow-y: auto;
      padding: 0 32px 32px;
      margin-top: -50px; /* Overlap banner */
      position: relative;
      z-index: 1;
    }

    /* Header Info */
    .modal-header-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 24px;
    }

    .company-logo-placeholder {
      width: 88px;
      height: 88px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 800;
      color: var(--primary-color);
      margin-bottom: 16px;
      border: 4px solid white;
    }

    .job-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-main);
      text-align: center;
      margin: 0 0 8px;
      line-height: 1.2;
    }

    .company-link {
        font-size: 1.1rem;
        color: var(--text-muted);
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 0;
    }

    .verified-badge {
        color: #059669;
        font-size: 0.85rem;
        background: #ecfdf5;
        padding: 2px 8px;
        border-radius: 99px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;
    }

    /* Meta Grid */
    .meta-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 16px;
        margin-bottom: 32px;
        background: #f8fafc;
        padding: 16px;
        border-radius: 16px;
        border: 1px solid #e2e8f0;
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .meta-icon {
        width: 40px;
        height: 40px;
        background: white;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-color);
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        border: 1px solid #eaeaea;
    }

    .meta-text {
        display: flex;
        flex-direction: column;
    }

    .meta-text .label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #94a3b8;
        font-weight: 600;
    }

    .meta-text .value {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text-main);
    }

    /* Content Sections */
    .section-content {
        margin-bottom: 32px;
    }

    .section-content h3 {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text-main);
        margin: 0 0 12px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .description-text {
        color: #4b5563;
        line-height: 1.7;
        font-size: 1rem;
        white-space: pre-wrap;
    }

    .job-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .badge {
        background: #eef2ff;
        color: var(--primary-color);
        padding: 6px 14px;
        border-radius: 99px;
        font-size: 0.85rem;
        font-weight: 500;
        border: 1px solid #e0e7ff;
    }

    /* Timeline */
    .application-timeline {
        background: #fafafa;
        border-radius: 16px;
        padding: 24px;
        border: 1px dashed #cbd5e1;
    }

    .timeline-steps {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .timeline-step {
        display: flex;
        gap: 16px;
    }

    .marker {
        width: 28px;
        height: 28px;
        background: var(--primary-color);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.9rem;
        flex-shrink: 0;
        margin-top: 2px;
    }

    .timeline-step .content h4 {
        margin: 0 0 4px;
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-main);
    }

    .timeline-step .content p {
        margin: 0;
        font-size: 0.9rem;
        color: var(--text-muted);
    }

    .timeline-info-box {
        background: #e0f2fe;
        color: #0369a1;
        padding: 12px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.9rem;
        margin-top: 8px;
    }

    .timeline-info-box.internal {
        background: #ecfdf5;
        color: #047857;
    }

    /* Footer */
    .modal-footer {
        padding: 20px 32px;
        border-top: 1px solid #f3f4f6;
        background: white;
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        position: sticky;
        bottom: 0;
        z-index: 10;
    }

    .btn-cancel {
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 600;
        border: 1px solid #e5e7eb;
        background: white;
        color: var(--text-main);
        cursor: pointer;
        transition: all 0.2s;
    }
    .btn-cancel:hover { background: #f9fafb; }

    .btn-apply {
        padding: 12px 32px;
        border-radius: 12px;
        font-weight: 600;
        border: none;
        background: linear-gradient(135deg, var(--primary-color), #4338ca);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        transition: all 0.2s;
    }
    .btn-apply:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
    }

    .btn-apply.internal {
        background: linear-gradient(135deg, var(--success-color), #059669);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .btn-apply.internal:hover {
        box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
    }

    .btn-disabled {
        padding: 12px 32px;
        border-radius: 12px;
        font-weight: 600;
        border: none;
        background: #e5e7eb;
        color: #9ca3af;
        cursor: not-allowed;
    }

    /* Utils */
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    @media (max-width: 640px) {
        .modal-content { border-radius: 20px 20px 0 0; max-height: 95vh; margin-top: auto; }
        .modal-overlay { padding: 0; align-items: flex-end; }
        .modal-banner { height: 100px; }
        .company-logo-placeholder { width: 64px; height: 64px; font-size: 24px; }
        .job-title { font-size: 1.25rem; }
        .meta-grid { grid-template-columns: 1fr 1fr; }
        .modal-footer { padding: 16px; flex-direction: column-reverse; }
        .btn-cancel, .btn-apply { width: 100%; justify-content: center; }
    }
  `]
})
export class JobDetailsModalComponent {
  @Input() job: any;
  @Input() isOpen = false;
  @Input() showApplicationForm = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() apply = new EventEmitter<{ job: any, coverLetter: string }>();

  isApplying = false;

  close() {
    this.closeModal.emit();
    this.isApplying = false;
  }

  handleInternalApply() {
    this.isApplying = true;
    this.apply.emit({ job: this.job, coverLetter: 'Direct platform application' });
    // Note: The parent component should handle the actual API call and then close the modal
  }

  goToExternalSite() {
    if (this.job && this.job.url) {
      // Emit apply event to track usage if needed
      this.apply.emit({ job: this.job, coverLetter: 'Candidature externe' });
      window.open(this.job.url, '_blank');
      this.close();
    }
  }

  getDomain(url: string): string {
    if (!url) return 'Extern Site';
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '');
    } catch {
      return 'Extern Site';
    }
  }

  getButtonText(): string {
    if (!this.job || !this.job.url) return 'Apply Now';
    return 'View on ' + this.getDomain(this.job.url);
  }

  getCompanyInitials(name: string): string {
    if (!name) return 'Job';
    return name.substring(0, 2).toUpperCase();
  }

  getDefaultDescription(): string {
    return 'No additional details provided. Please verify the information on the external site.';
  }
}
