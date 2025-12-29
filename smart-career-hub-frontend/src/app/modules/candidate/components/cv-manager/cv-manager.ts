// File updated to fix template path issue
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cv-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cv-manager.html',
  styleUrls: ['./cv-manager.css']
})
export class CvManagerComponent {
  cvList = [
    {
      id: 1,
      name: 'CV_Developpeur_Fullstack.pdf',
      type: 'pdf',
      date: '15 Déc 2023',
      isDefault: true,
      size: '1.2 MB'
    },
    {
      id: 2,
      name: 'CV_Designer_UX.pdf',
      type: 'pdf',
      date: '10 Déc 2023',
      isDefault: false,
      size: '2.5 MB'
    }
  ];

  coverLetters = [
    {
      id: 1,
      name: 'LM_Google.docx',
      type: 'docx',
      date: '18 Déc 2023'
    }
  ];

  activeTab: 'cv' | 'lm' = 'cv';
  showGenerator = false;
  showAnalysis = false;
  generationType: 'cv' | 'lm' = 'cv';
  isGenerating = false;
  isAnalyzing = false;
  analysisResult: any = null;
  selectedFile: File | null = null;

  setActiveTab(tab: 'cv' | 'lm') {
    this.activeTab = tab;
  }

  openGenerator(type: 'cv' | 'lm') {
    this.generationType = type;
    this.showGenerator = true;
    this.showAnalysis = false;
  }

  openAnalysis() {
    this.showAnalysis = true;
    this.showGenerator = false;
    this.analysisResult = null;
  }

  closeModals() {
    this.showGenerator = false;
    this.showAnalysis = false;
    this.analysisResult = null;
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  analyzeDocument() {
    if (!this.selectedFile) return;

    this.isAnalyzing = true;
    // Simulate IA Analysis
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
    // Simulate generation
    setTimeout(() => {
      this.isGenerating = false;
      this.showGenerator = false;
      // Add a mock document to the list
      if (this.generationType === 'cv') {
        this.cvList.unshift({
          id: Date.now(),
          name: 'CV_IA_Genere_' + new Date().toLocaleDateString() + '.pdf',
          type: 'pdf',
          date: 'Aujourd\'hui',
          isDefault: false,
          size: '1.4 MB'
        });
      } else {
        this.coverLetters.unshift({
          id: Date.now(),
          name: 'LM_IA_Genere_' + new Date().toLocaleDateString() + '.docx',
          type: 'docx',
          date: 'Aujourd\'hui'
        });
      }
    }, 2000);
  }
}
