import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { IOrder } from 'src/app/models/order.model';
import { ModalService } from 'src/app/services/modal.service';
import { OrderService } from 'src/app/services/order.service';
import { deleteOrder, loadOrders } from 'src/app/store/actions/order.actions';
import { selectAllOrders } from 'src/app/store/selectors/order.selectors';

@Component({
	selector: 'app-orders-page',
	templateUrl: './orders-page.component.html',
	styleUrls: ['./orders-page.component.scss'],
})
export class OrdersPageComponent implements OnInit {
	@ViewChild('ordersTb') ordersTable!: Table;

	constructor(public modal: ModalService, private router: Router, private store: Store) {}

	orders$: Observable<IOrder[]> = this.store.select(selectAllOrders);
	cols: any[] = [];
	ordersList: IOrder[] = [];
	selectedColumns: any[] = [];
	activeOrder: IOrder | null = null;
	activeOrderId: string | undefined = undefined;
	confirmationMessage: string = '';
	fieldsArray: string[] = [];

	ngOnInit() {
		this.orders$.subscribe((orders) => {
			if (!orders || orders.length === 0) {
				this.store.dispatch(loadOrders());
			} else {
				this.ordersList = [...orders];
			}
		});

		this.cols = [
			{ field: 'orderNumber', header: 'Numer', selected: true, width: '10rem' },
			{ field: 'carrierDetails.name', header: 'Przewoźnik', selected: true },
			{ field: 'carrierDetails.adress', header: 'Adres przewoźnika' },
			{ field: 'carrierDetails.phone', header: 'Telefon przewoźnika' },
			{ field: 'carrierDetails.vat', header: 'VAT przewoźnika' },
			{ field: 'carrierDetails.email', header: 'eMail przewoźnika' },
			{ field: 'clientDetails.name', header: 'Klient' },
			{ field: 'clientDetails.adress', header: 'Adres klienta' },
			{ field: 'clientDetails.phone', header: 'Telefon klienta' },
			{ field: 'clientDetails.vat', header: 'VAT klienta' },
			{ field: 'clientDetails.email', header: 'eMail klienta' },
			{ field: 'orderDetails.loadDate', header: 'Data załadunku' },
			{ field: 'orderDetails.loadHrs', header: 'Godzina załadunku' },
			{ field: 'orderDetails.loadPlace', header: 'Miejsce załadunku' },
			{ field: 'orderDetails.loadAddress', header: 'Adres załadunku' },
			{ field: 'orderDetails.unloadDate', header: 'Data rozładunku' },
			{ field: 'orderDetails.unloadHrs', header: 'Godzina rozładunku' },
			{ field: 'orderDetails.unloadPlace', header: 'Miejsce rozładunku' },
			{ field: 'orderDetails.unloadAddress', header: 'Adres rozładunku' },
			{ field: 'orderDetails.dimension', header: 'Ilość', selected: true },
			{ field: 'orderDetails.weight', header: 'Waga', selected: true, width: '10rem' },
			{ field: 'orderDetails.goods', header: 'Towar' },
			{ field: 'orderDetails.driver', header: 'Kierowca' },
			{ field: 'orderDetails.truck', header: 'Samochód' },
			{ field: 'conditions.adrDetails', header: 'Adr wymagania' },
			{ field: 'conditions.frigoDetails', header: 'Chłodnia wymagania' },
			{ field: 'conditions.fixDetails', header: 'Czas tranzytu' },
			{ field: 'conditions.isFrachtPln', header: 'Waluta', hidden: true },
			{ field: 'conditions.customerFreight', header: 'Fracht klienta', selected: true },
			{ field: 'conditions.customerTerm', header: 'Termin klienta' },
			{ field: 'conditions.carrierFreight', header: 'Fracht przewoźnika', selected: true },
			{ field: 'conditions.carrierTerm', header: 'Termin przewoźnika' },
			{ field: 'conditions.description', header: 'Dodatkowy opis' },
		];

		this.selectedColumns = this.cols.filter((col) => col.selected);
		this.fieldsArray = this.cols.filter((col) => !col.hidden).map((col) => col.field);
	}

	openAddModal($event: Event) {
		$event.preventDefault();
		this.modal.toggleModal('addCustomer');
	}

	handleInput(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		if (inputElement && inputElement.value != null) {
			this.ordersTable.filterGlobal(inputElement.value, 'contains');
		}
	}

	clear(table: Table) {
		table.clear();
		this.ordersList = [...this.ordersList];
	}

	goToEditOrCopyOrder(order: IOrder, action: string) {
		const orderParse = {
			clientDetails: JSON.stringify(order.clientDetails),
			carrierDetails: JSON.stringify(order.carrierDetails),
			orderDetails: JSON.stringify(order.orderDetails),
			conditions: JSON.stringify(order.conditions),
			...(action === 'edit' && { id: order.id }),
			...(action === 'edit' && { orderNumber: order.orderNumber }),
		};

		this.router.navigate(['/add-order'], { queryParams: orderParse });
	}

	openConfirmationModal($event: Event, order: IOrder) {
		$event.preventDefault();

		this.confirmationMessage = `Czy chesz usunąć zlecenie: ${order.orderNumber} ?`;
		this.activeOrderId = order.id;
		this.modal.toggleModal('confirmationModal');
	}

	deleteConfirmed($event: any) {
		this.store.dispatch(deleteOrder({ orderId: $event }));
	}

	resolveField(obj: any, path: string) {
		return path.split('.').reduce((o, i) => (o ? o[i] : null), obj);
	}

	combineFields(order: any, field: string, curr: any): string {
		const value = this.resolveField(order, field);
		const currency = this.resolveField(order, curr);
		return `${value} ${currency ? 'PLN' : 'EUR'}`;
	}

	showOrder($event: Event, order: IOrder) {
		$event.preventDefault();

		this.activeOrder = order;
		this.modal.toggleModal('showOrder');
	}

	sortNestedField(event: any) {
		const { data, field, order } = event;

		if (field === 'orderNumber') {
			return data.sort((a: any, b: any) => {
				const aValue = a[field];
				const bValue = b[field];

				const aLastFour = aValue.slice(-4);
				const bLastFour = bValue.slice(-4);

				const aFirstTwo = aValue.slice(0, 2);
				const bFirstTwo = bValue.slice(0, 2);

				const lastFourComparison = order * aLastFour.localeCompare(bLastFour, 'pl', { numeric: true });
				if (lastFourComparison !== 0) {
					return lastFourComparison;
				}

				return order * aFirstTwo.localeCompare(bFirstTwo, 'pl', { numeric: true });
			});
		} else {
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
	}

	getNestedValue(obj: any, path: string): any {
		return path.split('.').reduce((acc, key) => acc && acc[key], obj);
	}
}
