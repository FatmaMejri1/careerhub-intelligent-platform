import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CVAnalysisResult {
    experience_level: string;
    years_experience: number;
    summary: string;
    clarity_score: number;
    linguistic_faults: string[];
    visibility_recommendations: string[];
    recommended_jobs: string[];
    recommended_certificates: string[];
    tools_to_learn: string[];
    structural_feedback: string;
    extracted_skills: Array<{
        skill: string;
        level: string;
        confidence: number;
    }>;
}

@Injectable({
    providedIn: 'root'
})
export class AnalysisService {
    private apiUrl = 'http://localhost:9099/api/analysis';

    constructor(private http: HttpClient) { }

    analyzeCV(file: File, jobDescription?: string): Observable<CVAnalysisResult> {
        const formData = new FormData();
        formData.append('file', file);
        if (jobDescription) {
            formData.append('jobDescription', jobDescription);
        }

        return this.http.post<CVAnalysisResult>(`${this.apiUrl}/cv`, formData);
    }

    generateDocument(targetJob: string, additionalInfo: string, type: 'cv' | 'lm', profileData?: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/generate`, {
            targetJob,
            additionalInfo,
            type,
            profileData
        });
    }

    recommendForProfile(profileData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/recommend-profile`, profileData);
    }
}
