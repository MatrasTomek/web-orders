import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Store } from '@ngrx/store';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { IOrder } from 'src/app/models/order.model';
import { AuthService } from 'src/app/services/auth.service';
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

	credentials = { email: '', password: '' };
	inSubmission = false;
	showAlert = false;
	alertMsg = '';
	alertColor = 'info';

	constructor(
		public modal: ModalService,
		public auth: AuthService,
		private fireAuth: AngularFireAuth,
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

	async login() {
		this.showAlert = true;
		this.alertMsg = 'Proszę czekać, logowanie trwa...';
		this.alertColor = 'info';
		this.inSubmission = true;

		try {
			const userCredential = await this.fireAuth.signInWithEmailAndPassword(this.credentials.email, this.credentials.password);
			if (userCredential.user) {
				const userData = await this.auth.getUserData(userCredential.user.uid);
				if (userData?.docsOnly) {
					this.auth.isDocsOnlyUser$.next(true);
				}
			}
			this.auth.setDocsMode(true);
		} catch (e) {
			this.alertMsg = 'Błędny login lub hasło.';
			this.alertColor = 'warning';
			this.inSubmission = false;
		}
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
