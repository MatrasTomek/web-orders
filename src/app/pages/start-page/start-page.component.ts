import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import ICustomer from 'src/app/models/customer.model';
import { IOrder } from 'src/app/models/order.model';
import IUser from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { loadCustomers } from 'src/app/store/actions/customer.actions';
import { loadOrders } from 'src/app/store/actions/order.actions';
import { selectAllCustomers, selectCustomersLoading } from 'src/app/store/selectors/customer.selectors';
import { selectAllOrders, selectOrdersLoading } from 'src/app/store/selectors/order.selectors';

@Component({
	selector: 'app-start-page',
	templateUrl: './start-page.component.html',
	styleUrls: ['./start-page.component.scss'],
})
export class StartPageComponent {
	actualTime = new Date();
	customers$: Observable<ICustomer[]>;
	orders$: Observable<IOrder[]>;
	loading$: Observable<boolean>;

	constructor(public fbAuth: AngularFireAuth, public auth: AuthService, private store: Store) {
		this.customers$ = this.store.select(selectAllCustomers);
		this.orders$ = this.store.select(selectAllOrders);
		this.loading$ = this.store.select(selectCustomersLoading);
	}

	ngOnInit(): void {
		this.store.dispatch(loadCustomers());
		this.store.dispatch(loadOrders());
	}
}
