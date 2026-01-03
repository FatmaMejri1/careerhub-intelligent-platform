import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './cv-manager.html',
  styleUrls: ['./cv-manager.css']
})
export class CvManagerComponent implements OnInit {
  cvList: CVDocument[] = [];
  coverLetters: CVDocument[] = [];

  cvCount = 0;
  coverLetterCount = 0;

  activeTab: 'cv' | 'lm' = 'cv';
  showGenerator = false;
  showAnalysis = false;
  showUploadModal = false;
  generationType: 'cv' | 'lm' = 'cv';
  isGenerating = false;
  isAnalyzing = false;
  isUploading = false;
  analysisResult: any = null;
  selectedFile: File | null = null;

  ngOnInit() {
    this.loadDocuments();
    this.loadStats();
  }

  loadDocuments() {
    // Load from localStorage
    const cvs = localStorage.getItem('user_cvs');
    const letters = localStorage.getItem('user_cover_letters');

    this.cvList = cvs ? JSON.parse(cvs) : [];
    this.coverLetters = letters ? JSON.parse(letters) : [];
  }

  loadStats() {
    this.cvCount = this.cvList.length;
    this.coverLetterCount = this.coverLetters.length;
  }

  setActiveTab(tab: 'cv' | 'lm') {
    this.activeTab = tab;
  }

  openGenerator(type: 'cv' | 'lm') {
    this.generationType = type;
    this.showGenerator = true;
    this.showAnalysis = false;
    this.showUploadModal = false;
  }

  openUploadModal(type: 'cv' | 'lm') {
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
        type: this.generationType === 'cv' ? 'cv' : 'coverLetter',
        fileType: fileExtension,
        fileUrl: fileUrl,
        fileSize: this.selectedFile!.size,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (this.generationType === 'cv') {
        this.cvList.unshift(document);
        localStorage.setItem('user_cvs', JSON.stringify(this.cvList));
      } else {
        this.coverLetters.unshift(document);
        localStorage.setItem('user_cover_letters', JSON.stringify(this.coverLetters));
      }

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
    } else {
      this.coverLetters = this.coverLetters.filter(doc => doc.id !== documentId);
      localStorage.setItem('user_cover_letters', JSON.stringify(this.coverLetters));
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
    setTimeout(() => {
      this.isAnalyzing = false;
      this.analysisResult = {
        score: 85,
        strengths: ['Bonne structure', 'Compétences techniques claires'],
        weaknesses: ['Manque de chiffres clés', 'Description de poste trop courte'],
        recommendation: 'Ajoutez des résultats quantifiables pour vos expériences précédentes.'
      };
    }, 2500);
  }

  generateDocument() {
    this.isGenerating = true;
    setTimeout(() => {
      this.isGenerating = false;
      this.showGenerator = false;
      this.loadStats();
    }, 2000);
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
