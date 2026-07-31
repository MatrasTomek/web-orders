import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
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
		return this.http.post<{ url?: string; error?: string }>(environment.phpUploadUrl, formData).pipe(
			mergeMap((response) =>
				response?.url
					? [{ url: response.url }]
					: throwError(() => new Error(response?.error || 'Serwer nie zwrócił adresu pliku')),
			),
		);
	}

	getFilenameFromUrl(url: string): string {
		return url.split('/').pop() || url;
	}
}
