import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IOrder } from '../models/order.model';
import { ModalService } from '../services/modal.service';
import { DocumentService } from '../services/document.service';
import { addOrder } from '../store/actions/order.actions';

@Component({
	selector: 'app-add-doc-only-modal',
	templateUrl: './add-doc-only-modal.component.html',
	styleUrls: ['./add-doc-only-modal.component.scss'],
})
export class AddDocOnlyModalComponent implements OnInit, OnDestroy {
	unloadDate = new FormControl('', [Validators.required]);
	route = new FormControl('');

	selectedFile: File | null = null;
	isUploading = false;
	errorMessage = '';
	successMessage = '';

	constructor(
		public modal: ModalService,
		private store: Store,
		private documentService: DocumentService
	) {}

	ngOnInit(): void {
		this.modal.register('addDocOnlyModal');
	}

	ngOnDestroy(): void {
		this.modal.unregister('addDocOnlyModal');
	}

	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			this.selectedFile = input.files[0];
			this.errorMessage = '';
		}
	}

	upload(): void {
		if (!this.selectedFile || !this.unloadDate.value) return;

		this.isUploading = true;
		this.errorMessage = '';
		this.successMessage = '';

		this.documentService.uploadDocument(this.selectedFile, 'dokument', this.unloadDate.value).subscribe({
			next: (response) => {
				const newOrder: IOrder = {
					isDocOnly: true,
					clientDetails: { adress: '', name: '', vat: '' },
					carrierDetails: { adress: '', name: '', vat: '' },
					orderDetails: {
						loadDate: null,
						loadHrs: '',
						loadPlace: this.route.value || '',
						loadAddress: '',
						unloadDate: new Date(this.unloadDate.value!).getTime(),
						unloadHrs: '',
						unloadPlace: '',
						unloadAddress: '',
					},
					conditions: { customerTerm: '', customerFreight: '', carrierTerm: '', carrierFreight: '' },
					documentUrl: response.url,
				};

				this.store.dispatch(addOrder({ Order: newOrder }));
				this.successMessage = 'Dokument został dodany pomyślnie.';
				this.isUploading = false;
				this.resetForm();
			},
			error: () => {
				this.errorMessage = 'Błąd podczas przesyłania pliku. Spróbuj ponownie.';
				this.isUploading = false;
			},
		});
	}

	resetForm(): void {
		this.selectedFile = null;
		this.unloadDate.reset('');
		this.route.reset('');
	}

	close(): void {
		this.modal.toggleModal('addDocOnlyModal');
		this.errorMessage = '';
		this.successMessage = '';
		this.resetForm();
	}
}
