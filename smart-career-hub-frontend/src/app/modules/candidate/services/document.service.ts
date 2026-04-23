import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/services/api';
import { AuthService } from '../../shared/services/auth';

export interface CVDocument {
    id?: number;
    name: string;
    type: string; // 'cv' or 'coverLetter'
    fileType: string; // 'pdf', 'docx'
    fileUrl: string;
    fileSize?: number;
    isDefault: boolean;
    createdAt?: string;
    updatedAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    constructor(
        private apiService: ApiService,
        private authService: AuthService
    ) { }

    private getUserId(): string | null {
        const user = this.authService.getCurrentUser();
        return user?.id || null;
    }

    getUserDocuments(): Observable<CVDocument[]> {
        const userId = this.getUserId();
        if (!userId) throw new Error('User not logged in');
        return this.apiService.get<CVDocument[]>(`documents/user/${userId}`);
    }

    getUserDocumentsByType(type: string): Observable<CVDocument[]> {
        const userId = this.getUserId();
        if (!userId) throw new Error('User not logged in');
        return this.apiService.get<CVDocument[]>(`documents/user/${userId}/type/${type}`);
    }

    getDocumentStats(): Observable<{ cvCount: number; coverLetterCount: number }> {
        const userId = this.getUserId();
        if (!userId) throw new Error('User not logged in');
        return this.apiService.get<{ cvCount: number; coverLetterCount: number }>(`documents/user/${userId}/stats`);
    }

    uploadDocument(document: CVDocument): Observable<CVDocument> {
        const userId = this.getUserId();
        if (!userId) throw new Error('User not logged in');
        return this.apiService.post<CVDocument>(`documents/user/${userId}`, document);
    }

    deleteDocument(documentId: number): Observable<void> {
        return this.apiService.delete<void>(`documents/${documentId}`);
    }

    updateDocument(documentId: number, document: Partial<CVDocument>): Observable<CVDocument> {
        return this.apiService.put<CVDocument>(`documents/${documentId}`, document);
    }
}
