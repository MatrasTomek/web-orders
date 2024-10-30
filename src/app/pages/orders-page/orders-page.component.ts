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
			{ field: 'orderDetails.loadPlace', header: 'Miejsce załadunku' },
			{ field: 'orderDetails.loadAddress', header: 'Adres załadunku' },
			{ field: 'orderDetails.unloadDate', header: 'Data rozładunku' },
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
		const value1 = this.resolveField(event.data[event.index1], event.field);
		const value2 = this.resolveField(event.data[event.index2], event.field);

		let result = null;

		if (value1 == null && value2 != null) result = -1;
		else if (value1 != null && value2 == null) result = 1;
		else if (value1 == null && value2 == null) result = 0;
		else result = value1.localeCompare(value2);

		return event.order * result;
	}
}
