import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { IOrder } from 'src/app/models/order.model';
import { ModalService } from 'src/app/services/modal.service';
import { loadOrders } from 'src/app/store/actions/order.actions';
import { selectAllOrders } from 'src/app/store/selectors/order.selectors';

@Component({
	selector: 'app-docs-page',
	templateUrl: './docs-page.component.html',
	styleUrls: ['./docs-page.component.scss'],
})
export class DocsPageComponent implements OnInit {
	@ViewChild('docsTb') docsTable!: Table;

	constructor(
		public modal: ModalService,
		private store: Store,
	) {}

	orders$: Observable<IOrder[]> = this.store.select(selectAllOrders);
	ordersList: IOrder[] = [];
	activeOrder: IOrder | null = null;
	fieldsArray: string[] = [
		'carrierDetails.name',
		'orderDetails.loadPlace',
		'orderDetails.unloadPlace',
		'orderDetails.loadDate',
		'orderDetails.unloadDate',
	];

	ngOnInit() {
		this.orders$.subscribe((orders) => {
			if (!orders || orders.length === 0) {
				this.store.dispatch(loadOrders());
			} else {
				this.ordersList = [...orders];
			}
		});
	}

	handleInput(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		if (inputElement && inputElement.value != null) {
			this.docsTable.filterGlobal(inputElement.value, 'contains');
		}
	}

	clear(table: Table) {
		table.clear();
		this.ordersList = [...this.ordersList];
	}

	openDocsModal($event: Event, order: IOrder) {
		$event.preventDefault();
		this.activeOrder = order;
		this.modal.toggleModal('docsModal');
	}

	resolveField(obj: any, path: string) {
		return path.split('.').reduce((o, i) => (o ? o[i] : null), obj);
	}

	sortNestedField(event: any) {
		const { data, field, order } = event;

		return data.sort((a: any, b: any) => {
			const aValue = this.getNestedValue(a, field);
			const bValue = this.getNestedValue(b, field);

			if (typeof aValue === 'string' && typeof bValue === 'string') {
				return order * aValue.localeCompare(bValue, 'pl');
			} else if (typeof aValue === 'number' && typeof bValue === 'number') {
				return order * (aValue - bValue);
			} else {
				return 0;
			}
		});
	}

	getNestedValue(obj: any, path: string): any {
		return path.split('.').reduce((acc, key) => acc && acc[key], obj);
	}
}
