import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class DocumentService {
	constructor(private http: HttpClient) {}

	uploadDocument(file: File, carrierName: string, unloadDate: any): Observable<{ url: string }> {
		const safeName = carrierName.replace(/[^a-zA-Z0-9]/g, '_');
		const dateStr = new Date(unloadDate).toISOString().split('T')[0];
		const formData = new FormData();
		formData.append('file', file);
		formData.append('filename', `${safeName}_${dateStr}`);
		return this.http.post<{ url: string }>(environment.phpUploadUrl, formData);
	}

	getFilenameFromUrl(url: string): string {
		return url.split('/').pop() || url;
	}
}
