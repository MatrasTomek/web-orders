import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import ICustomer from 'src/app/models/customer.model';
import IUser from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { loadCustomers } from 'src/app/store/actions/customer.actions';
import { selectAllCustomers, selectCustomersLoading } from 'src/app/store/selectors/customer.selectors';

@Component({
	selector: 'app-start-page',
	templateUrl: './start-page.component.html',
	styleUrls: ['./start-page.component.scss'],
})
export class StartPageComponent {
	actualTime = new Date();
	customers$: Observable<ICustomer[]>;
	loading$: Observable<boolean>;

	constructor(public fbAuth: AngularFireAuth, public auth: AuthService, private store: Store) {
		this.customers$ = this.store.select(selectAllCustomers);
		this.loading$ = this.store.select(selectCustomersLoading);
	}

	ngOnInit(): void {
		this.store.dispatch(loadCustomers());
	}
}
