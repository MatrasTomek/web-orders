import { Component, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllCustomers } from 'src/app/store/selectors/customer.selectors';
import { deleteCustomer, loadCustomers } from '../../store/actions/customer.actions';
import { Observable } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';
import { Table } from 'primeng/table';
import ICustomer from 'src/app/models/customer.model';

@Component({
	selector: 'app-customers-page',
	templateUrl: './customers-page.component.html',
	styleUrls: ['./customers-page.component.scss'],
})
export class CustomersPageComponent {
	@ViewChild('customersTb') customersTable!: Table;

	constructor(public modal: ModalService, private store: Store) {}

	customers$: Observable<ICustomer[]> = this.store.select(selectAllCustomers);
	customersList: ICustomer[] = [];
	activeCustomer: ICustomer | null = null;
	customerId: string | undefined = undefined;
	confirmationMessage: string = '';

	ngOnInit() {
		this.customers$.subscribe((customers) => {
			if (!customers || customers.length === 0) {
				this.store.dispatch(loadCustomers());
			} else {
				this.customersList = [...customers];
			}
		});
	}

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
		this.customersList = [...this.customersList];
	}

	editCustomer($event: Event, customer: ICustomer) {
		$event.preventDefault();
		this.activeCustomer = customer;
		this.modal.toggleModal('editCustomer');
	}

	openConfirmationModal($event: Event, customer: ICustomer) {
		$event.preventDefault();

		this.confirmationMessage = `Czy chesz usunąć klienta: ${customer.name} ?`;
		this.customerId = customer.id;
		this.modal.toggleModal('confirmationModal');
	}

	deleteConfirmed($event: string) {
		const customerId = $event;

		this.store.dispatch(deleteCustomer({ customerId }));
	}
}
