import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IOrder, STANDALONE_CARRIER_NAME } from '../models/order.model';
import { ModalService } from '../services/modal.service';
import { DocumentService } from '../services/document.service';
import { addOrder } from '../store/actions/order.actions';

// Samo `required` przepuszcza ciąg spacji — trasa musi mieć realną treść.
// Zwracamy klucz `required`, żeby app-input pokazał istniejący komunikat.
function nonBlank(control: AbstractControl): ValidationErrors | null {
	return typeof control.value === 'string' && !control.value.trim() ? { required: true } : null;
}

@Component({
	selector: 'app-add-doc-only-modal',
	templateUrl: './add-doc-only-modal.component.html',
	styleUrls: ['./add-doc-only-modal.component.scss'],
})
export class AddDocOnlyModalComponent implements OnInit, OnDestroy {
	@ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

	loadDate = new FormControl<Date | null>(null);
	unloadDate = new FormControl<Date | null>(null, [Validators.required]);
	route = new FormControl('', [Validators.required, nonBlank]);

	selectedFile: File | null = null;
	isUploading = false;
	errorMessage = '';
	successMessage = '';

	get isFormValid(): boolean {
		// Data załadunku jest opcjonalna — nie wchodzi do warunku.
		return !!this.selectedFile && this.unloadDate.valid && this.route.valid;
	}

	constructor(
		public modal: ModalService,
		private store: Store,
		private documentService: DocumentService,
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
		if (!this.isFormValid) {
			this.unloadDate.markAsTouched();
			this.unloadDate.markAsDirty();
			this.route.markAsTouched();
			this.route.markAsDirty();
			return;
		}

		this.isUploading = true;
		this.errorMessage = '';
		this.successMessage = '';

		this.documentService.uploadDocument(this.selectedFile!, STANDALONE_CARRIER_NAME, this.unloadDate.value).subscribe({
			next: (response) => {
				const newOrder: IOrder = {
					isDocOnly: true,
					clientDetails: { adress: '', name: '', vat: '' },
					carrierDetails: { adress: '', name: STANDALONE_CARRIER_NAME, vat: '' },
					orderDetails: {
						loadDate: this.loadDate.value ? new Date(this.loadDate.value).getTime() : null,
						loadHrs: '',
						loadPlace: this.route.value!.trim(),
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
		// Bez tego natywny input pliku dalej pokazuje poprzedni plik po zapisie.
		if (this.fileInput) {
			this.fileInput.nativeElement.value = '';
		}
		this.loadDate.reset(null);
		this.unloadDate.reset(null);
		this.route.reset('');
	}

	close(): void {
		this.modal.toggleModal('addDocOnlyModal');
		this.errorMessage = '';
		this.successMessage = '';
		this.resetForm();
	}
}
