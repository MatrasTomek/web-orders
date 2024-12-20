import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { addCustomer } from '../store/actions/customer.actions';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';
import ICustomer from '../models/customer.model';
import { first, Observable } from 'rxjs';
import { selectAllCustomers } from '../store/selectors/customer.selectors';

@Component({
	selector: 'app-add-customer-modal',
	templateUrl: './add-customer-modal.component.html',
	styleUrls: ['./add-customer-modal.component.scss'],
})
export class AddCustomerModalComponent implements OnInit, OnDestroy {
	@Input() activeCustomer: ICustomer | null = null;
	@Input() kindOfCustomer?: 'client' | 'carrier' | null = null;
	@Output() addUpdate = new EventEmitter();

	constructor(public modal: ModalService, private store: Store) {}

	customers$: Observable<ICustomer[]> = this.store.select(selectAllCustomers);

	inSubmission: boolean = false;

	showAlert: boolean = false;
	alertMsg: string = 'Proszę czekać, klient jest zapisywany.';
	alertColor: string = 'info';

	name = new FormControl('', [Validators.required, Validators.minLength(3)]);
	address = new FormControl('', [Validators.required, Validators.minLength(3)]);
	vat = new FormControl('', [Validators.required, Validators.minLength(10)]);
	email = new FormControl('', [Validators.email]);
	phone = new FormControl('', [Validators.minLength(9)]);

	customerForm = new FormGroup({
		name: this.name,
		adress: this.address,
		vat: this.vat,
		email: this.email,
		phone: this.phone,
	});

	ngOnInit(): void {
		this.modal.register('addCustomer');
	}

	ngOnChanges() {
		if (!this.activeCustomer) {
			return;
		}
	}

	ngOnDestroy() {
		this.modal.unregister('addCustomer');
	}

	addCustomer() {
		this.showAlert = true;
		this.alertMsg = 'Proszę czekać, klient jest dodawany.';
		this.alertColor = 'info';
		this.inSubmission = true;

		const vat = this.customerForm.get('vat')?.value?.trim();

		this.customers$.pipe(first()).subscribe((customers) => {
			const vatExists = customers.some((customer) => customer.vat.trim() === vat);

			if (vatExists) {
				this.alertMsg = 'Klient z podanym numerem VAT już istnieje.';
				this.alertColor = 'warning';
				this.inSubmission = false;
				setTimeout(() => {
					this.showAlert = false;
				}, 3000);
				return;
			}

			try {
				this.store.dispatch(addCustomer({ customer: this.customerForm.value as ICustomer }));
			} catch (e) {
				console.error(e);

				this.alertMsg = 'Cos poszło nie tak, spróbuj jeszcze raz za chwilę.';
				this.alertColor = 'warning';
				this.inSubmission = false;

				setTimeout(() => {
					this.showAlert = false;
				}, 3000);

				return;
			}

			this.addUpdate.emit();

			this.alertMsg = 'Sukces! Klient dodany.';
			this.alertColor = 'success';
			this.inSubmission = false;
			this.closeModal('close');

			setTimeout(() => {
				this.showAlert = false;
			}, 2500);
		});
	}

	closeModal($event: any) {
		this.modal.toggleModal('addCustomer');
	}
}
