import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisService, CVAnalysisResult } from '../../../../core/services/analysis.service';
import { FormsModule } from '@angular/forms';

export interface CVDocument {
  id?: number;
  name: string;
  type: string;
  fileType: string;
  fileUrl: string;
  fileSize?: number;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-cv-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cv-manager.html',
  styleUrls: ['./cv-manager.css']
})
export class CvManagerComponent implements OnInit {
  cvList: CVDocument[] = [];
  cvCount = 0;

  showGenerator = false;
  showAnalysis = false;
  showUploadModal = false;
  generationType: 'cv' = 'cv';
  isGenerating = false;
  isAnalyzing = false;
  isUploading = false;
  analysisResult: CVAnalysisResult | null = null;
  selectedFile: File | null = null;

  // Generator inputs
  targetJob = '';
  additionalInfo = '';

  constructor(private analysisService: AnalysisService) { }

  ngOnInit() {
    this.loadDocuments();
    this.loadStats();
  }

  loadDocuments() {
    // Load from localStorage
    const cvs = localStorage.getItem('user_cvs');
    this.cvList = cvs ? JSON.parse(cvs) : [];
  }

  loadStats() {
    this.cvCount = this.cvList.length;
  }


  openGenerator(type: 'cv') {
    this.generationType = type;
    this.showGenerator = true;
    this.showAnalysis = false;
    this.showUploadModal = false;
  }

  openUploadModal(type: 'cv') {
    this.generationType = type;
    this.showUploadModal = true;
    this.showGenerator = false;
    this.showAnalysis = false;
  }

  openAnalysis() {
    this.showAnalysis = true;
    this.showGenerator = false;
    this.showUploadModal = false;
    this.analysisResult = null;
  }

  closeModals() {
    this.showGenerator = false;
    this.showAnalysis = false;
    this.showUploadModal = false;
    this.analysisResult = null;
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadDocument() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileUrl = e.target?.result as string;
      const fileExtension = this.selectedFile!.name.split('.').pop() || 'pdf';

      const document: CVDocument = {
        id: Date.now(),
        name: this.selectedFile!.name,
        type: 'cv',
        fileType: fileExtension,
        fileUrl: fileUrl,
        fileSize: this.selectedFile!.size,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.cvList.unshift(document);
      localStorage.setItem('user_cvs', JSON.stringify(this.cvList));

      this.isUploading = false;
      this.closeModals();
      this.loadStats();
    };

    reader.readAsDataURL(this.selectedFile);
  }

  deleteDocument(documentId: number, type: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;

    if (type === 'cv') {
      this.cvList = this.cvList.filter(doc => doc.id !== documentId);
      localStorage.setItem('user_cvs', JSON.stringify(this.cvList));
    }

    this.loadStats();
  }

  downloadDocument(doc: CVDocument) {
    const link = document.createElement('a');
    link.href = doc.fileUrl;
    link.download = doc.name;
    link.click();
  }

  setAsDefault(documentId: number) {
    this.cvList.forEach(doc => {
      doc.isDefault = doc.id === documentId;
    });
    localStorage.setItem('user_cvs', JSON.stringify(this.cvList));
  }

  analyzeDocument() {
    if (!this.selectedFile) return;

    this.isAnalyzing = true;
    this.analysisService.analyzeCV(this.selectedFile).subscribe({
      next: (result) => {
        this.analysisResult = result;
        this.isAnalyzing = false;
      },
      error: (err) => {
        console.error('Analysis failed:', err);
        this.isAnalyzing = false;
        alert('L\'analyse a échoué. Veuillez réessayer.');
      }
    });
  }

  generateDocument() {
    if (!this.targetJob) {
      alert('Veuillez spécifier le poste visé.');
      return;
    }

    this.isGenerating = true;
    this.analysisService.generateDocument(this.targetJob, this.additionalInfo, this.generationType).subscribe({
      next: (result) => {
        // Create a fake file from the generated content
        const generatedText = this.formatGeneratedCV(result);

        const blob = new Blob([generatedText], { type: 'text/plain' });
        const fileName = `CV_${this.targetJob.replace(/\s+/g, '_')}.txt`;

        const reader = new FileReader();
        reader.onload = (e) => {
          const fileUrl = e.target?.result as string;

          const document: CVDocument = {
            id: Date.now(),
            name: fileName,
            type: 'cv',
            fileType: 'txt',
            fileUrl: fileUrl,
            fileSize: blob.size,
            isDefault: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          this.cvList.unshift(document);
          localStorage.setItem('user_cvs', JSON.stringify(this.cvList));

          this.isGenerating = false;
          this.showGenerator = false;
          this.loadStats();
          this.targetJob = '';
          this.additionalInfo = '';
          alert('Document généré avec succès !');
        };
        reader.readAsDataURL(blob);
      },
      error: (err) => {
        console.error('Generation failed:', err);
        this.isGenerating = false;
        alert('La génération a échoué. Veuillez réessayer.');
      }
    });
  }

  private formatGeneratedCV(data: any): string {
    let cv = `CURRICULUM VITAE\n`;
    cv += `================\n\n`;
    cv += `NOM: ${data.full_name || '[Votre Nom]'}\n\n`;
    cv += `RÉSUMÉ PROFESSIONNEL\n`;
    cv += `---------------------\n`;
    cv += `${data.professional_summary || ''}\n\n`;

    cv += `COMPÉTENCES\n`;
    cv += `-----------\n`;
    if (data.skills) {
      data.skills.forEach((s: string) => cv += `- ${s}\n`);
    }
    cv += `\n`;

    cv += `EXPÉRIENCES PROFESSIONNELLES\n`;
    cv += `----------------------------\n`;
    if (data.experiences) {
      data.experiences.forEach((exp: any) => {
        cv += `${exp.title} | ${exp.company} | ${exp.duration}\n`;
        if (exp.responsibilities) {
          exp.responsibilities.forEach((r: string) => cv += `  * ${r}\n`);
        }
        cv += `\n`;
      });
    }

    cv += `FORMATION\n`;
    cv += `---------\n`;
    if (data.education) {
      data.education.forEach((edu: string) => cv += `- ${edu}\n`);
    }

    return cv;
  }

  downloadAnalysisReport() {
    if (!this.analysisResult) return;

    let report = `RAPPORT D'ANALYSE IA - SMART CAREER HUB\n`;
    report += `=======================================\n\n`;
    report += `SCORE DE CLARTÉ : ${this.analysisResult.clarity_score}%\n`;
    report += `NIVEAU D'EXPÉRIENCE : ${this.analysisResult.experience_level}\n`;
    report += `ANNÉES D'EXPÉRIENCE : ${this.analysisResult.years_experience}\n\n`;

    report += `RÉSUMÉ DU PROFIL\n`;
    report += `----------------\n`;
    report += `${this.analysisResult.summary}\n\n`;

    if (this.analysisResult.linguistic_faults.length > 0) {
      report += `FAUTES LINGUISTIQUES DÉTECTÉES\n`;
      report += `-----------------------------\n`;
      this.analysisResult.linguistic_faults.forEach(f => report += `- ${f}\n`);
      report += `\n`;
    }

    report += `RECOMMANDATIONS DE VISIBILITÉ\n`;
    report += `-----------------------------\n`;
    this.analysisResult.visibility_recommendations.forEach(r => report += `- ${r}\n`);
    report += `\n`;

    report += `MÉTIERS RECOMMANDÉS\n`;
    report += `-------------------\n`;
    this.analysisResult.recommended_jobs.forEach(j => report += `- ${j}\n`);
    report += `\n`;

    report += `OUTILS À APPRENDRE\n`;
    report += `------------------\n`;
    this.analysisResult.tools_to_learn.forEach(t => report += `- ${t}\n`);
    report += `\n`;

    report += `CERTIFICATIONS RECOMMANDÉES\n`;
    report += `---------------------------\n`;
    this.analysisResult.recommended_certificates.forEach(c => report += `- ${c}\n`);
    report += `\n`;

    report += `FEEDBACK STRUCTUREL\n`;
    report += `-------------------\n`;
    report += `${this.analysisResult.structural_feedback}\n`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rapport_Analyse_CV_${new Date().getTime()}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Aujourd\'hui';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return '0 KB';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
}
