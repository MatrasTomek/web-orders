import { Component, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';
import { Table } from 'primeng/table';
import ICustomer from 'src/app/models/customer.model';
import { selectAllCustomers } from 'src/app/store/selectors/customer.selectors';

@Component({
	selector: 'app-customers-page',
	templateUrl: './customers-page.component.html',
	styleUrls: ['./customers-page.component.scss'],
})
export class CustomersPageComponent {
	@ViewChild('customersTb') customersTable!: Table;

	constructor(public modal: ModalService, private store: Store) {}

	customers$: Observable<ICustomer[]> = this.store.select(selectAllCustomers);
	allUsers: any = [];
	activeCustomer: ICustomer | null = null;
	confirmationMessage: string = '';

	openAddModal($event: Event) {
		$event.preventDefault();
		this.modal.toggleModal('addCustomer');
	}

	handleInput(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		if (inputElement && inputElement.value != null) {
			this.customersTable.filterGlobal(inputElement.value, 'contains');
		}
	}

	clear(table: Table) {
		table.clear();
	}

	editCustomer($event: Event, customer: ICustomer) {
		$event.preventDefault();

		this.activeCustomer = customer;
		this.modal.toggleModal('editCustomer');
	}

	addUpdate($event: ICustomer) {
		return this.allUsers.unshift($event);
	}

	editUpdate($event: ICustomer) {
		this.allUsers.forEach((item: { id: any }, index: any) => {
			if (item.id === $event.id) {
				this.allUsers[index] = $event;
			}
		});
	}

	openConfirmationModal($event: Event, customer: ICustomer) {
		$event.preventDefault();

		this.confirmationMessage = `Czy chesz usunąć klienta: ${customer.name} ?`;
		this.activeCustomer = customer;
		this.modal.toggleModal('confirmationModal');
	}

	deleteConfirmed($event: any) {
		// this.customers.deleteCustomer($event);

		this.allUsers.forEach((item: { id: any }, index: any) => {
			if (item.id === $event.id) {
				this.allUsers.splice(index, 1);
			}
		});
	}
}
