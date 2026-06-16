import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IOrder } from '../models/order.model';
import { ModalService } from '../services/modal.service';
import { DocumentService } from '../services/document.service';
import { editOrder } from '../store/actions/order.actions';

@Component({
	selector: 'app-docs-modal',
	templateUrl: './docs-modal.component.html',
	styleUrls: ['./docs-modal.component.scss'],
})
export class DocsModalComponent implements OnInit, OnDestroy {
	@Input() activeOrder: IOrder | null = null;

	selectedFile: File | null = null;
	isUploading = false;
	errorMessage = '';
	successMessage = '';
	showUploadView = false;

	constructor(
		public modal: ModalService,
		private store: Store,
		public documentService: DocumentService
	) {}

	ngOnInit(): void {
		this.modal.register('docsModal');
	}

	ngOnDestroy(): void {
		this.modal.unregister('docsModal');
	}

	get hasDocument(): boolean {
		return !!this.activeOrder?.documentUrl && !this.showUploadView;
	}

	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			this.selectedFile = input.files[0];
			this.errorMessage = '';
		}
	}

	upload(): void {
		if (!this.selectedFile || !this.activeOrder) return;

		const carrierName = this.activeOrder.carrierDetails?.name || 'dokument';
		const unloadDate = this.activeOrder.orderDetails?.unloadDate;

		this.isUploading = true;
		this.errorMessage = '';
		this.successMessage = '';

		this.documentService.uploadDocument(this.selectedFile, carrierName, unloadDate).subscribe({
			next: (response) => {
				this.store.dispatch(
					editOrder({
						orderId: this.activeOrder!.id!,
						order: { ...this.activeOrder!, documentUrl: response.url },
					})
				);
				this.successMessage = 'Dokument został przesłany pomyślnie.';
				this.isUploading = false;
				this.selectedFile = null;
				this.showUploadView = false;
			},
			error: () => {
				this.errorMessage = 'Błąd podczas przesyłania pliku. Spróbuj ponownie.';
				this.isUploading = false;
			},
		});
	}

	openInNewTab(): void {
		if (this.activeOrder?.documentUrl) {
			window.open(this.activeOrder.documentUrl, '_blank');
		}
	}

	switchToUpload(): void {
		this.showUploadView = true;
		this.errorMessage = '';
		this.successMessage = '';
		this.selectedFile = null;
	}

	cancelUpload(): void {
		this.showUploadView = false;
		this.errorMessage = '';
		this.selectedFile = null;
	}

	close(): void {
		this.modal.toggleModal('docsModal');
		this.showUploadView = false;
		this.errorMessage = '';
		this.successMessage = '';
		this.selectedFile = null;
	}
}
