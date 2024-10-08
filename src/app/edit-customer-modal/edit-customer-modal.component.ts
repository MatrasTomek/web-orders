import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { editCustomer } from '../store/actions/customer.actions';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';
import ICustomer from '../models/customer.model';

@Component({
	selector: 'app-edit-customer-modal',
	templateUrl: './edit-customer-modal.component.html',
	styleUrls: ['./edit-customer-modal.component.scss'],
})
export class EditCustomerModalComponent implements OnInit, OnDestroy {
	@Input() activeCustomer: ICustomer | null = null;
	@Output() editUpdate = new EventEmitter();

	inSubmission: boolean = false;

	showAlert: boolean = false;
	alertMsg: string = 'Proszę czekać, klient jest zapisywany.';
	alertColor: string = 'info';

	name = new FormControl('', [Validators.required, Validators.minLength(3)]);
	address = new FormControl('', [Validators.required, Validators.minLength(3)]);
	vat = new FormControl('', [Validators.required, Validators.minLength(10)]);
	email = new FormControl('', [Validators.email]);
	phone = new FormControl('', [Validators.minLength(9)]);
	customerID = new FormControl('');

	editCustomerForm = new FormGroup({
		name: this.name,
		adress: this.address,
		vat: this.vat,
		email: this.email,
		phone: this.phone,
		id: this.customerID,
	});

	constructor(public modal: ModalService, private store: Store) {}

	ngOnInit(): void {
		this.modal.register('editCustomer');
	}

	ngOnChanges() {
		if (!this.activeCustomer) {
			return;
		}
		this.inSubmission = false;
		this.showAlert = false;
		this.name.setValue(this.activeCustomer.name);
		this.address.setValue(this.activeCustomer.adress);
		this.vat.setValue(this.activeCustomer.vat);
		this.email.setValue(this.activeCustomer.email as string);
		this.phone.setValue(this.activeCustomer.phone as string);
		this.customerID.setValue(this.activeCustomer.id as string);
	}

	ngOnDestroy() {
		this.modal.unregister('editCustomer');
	}

	editCustomer() {
		if (!this.activeCustomer) {
			return;
		}
		this.showAlert = true;
		this.alertMsg = 'Proszę czekać, klient jest zapisywany.';
		this.alertColor = 'info';
		this.inSubmission = true;
		try {
			this.store.dispatch(editCustomer({ customer: this.editCustomerForm.value as ICustomer }));
			// this.customer.editCustomer(
			//     this.activeCustomer.id as string,
			//     this.editCustomerForm.value as ICustomer
			//   );
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
		this.editUpdate
			.emit
			// this.editCustomerForm.value as ICustomer
			();

		this.alertMsg = 'Sukces! Klient zapisany.';
		this.alertColor = 'success';
		this.closeModal('close');
		setTimeout(() => {
			this.showAlert = false;
		}, 2500);
	}

	closeModal($event: any) {
		this.modal.toggleModal('editCustomer');
	}
}
