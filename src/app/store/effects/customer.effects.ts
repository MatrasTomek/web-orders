import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { CustomerService } from '../../services/customer.service';
import {
	loadCustomers,
	loadCustomersSuccess,
	loadCustomersFailure,
	addCustomer,
	addCustomerSuccess,
	addCustomerFailure,
	editCustomer,
	editCustomerSuccess,
	editCustomerFailure,
	deleteCustomer,
	deleteCustomerSuccess,
	deleteCustomerFailure,
} from '../actions/customer.actions';
import { Injectable } from '@angular/core';
import ICustomer from 'src/app/models/customer.model';

@Injectable()
export class CustomerEffects {
	constructor(private actions$: Actions, private customerService: CustomerService) {}

	loadCustomers$ = createEffect(() =>
		this.actions$.pipe(
			ofType(loadCustomers),
			mergeMap(() =>
				from(this.customerService.getCustomers()).pipe(
					map((customers) => loadCustomersSuccess({ customers })),
					catchError((error) => of(loadCustomersFailure({ error: error.message })))
				)
			)
		)
	);

	addCustomer$ = createEffect(() =>
		this.actions$.pipe(
			ofType(addCustomer),
			mergeMap(({ customer }) =>
				this.customerService.createCustomer(customer).then((docRef) =>
					docRef.get().then((doc) => {
						const newCustomer = { id: docRef.id, ...doc.data() } as ICustomer;
						return addCustomerSuccess({ customer: newCustomer });
					})
				)
			)
		)
	);

	editCustomer$ = createEffect(() =>
		this.actions$.pipe(
			ofType(editCustomer),
			mergeMap(({ customer }) => {
				return from(this.customerService.editCustomer(customer.id!, customer)).pipe(
					map(() => editCustomerSuccess({ customer })),
					catchError((error) => of(editCustomerFailure({ error: error.message })))
				);
			})
		)
	);

	deleteCustomer$ = createEffect(() =>
		this.actions$.pipe(
			ofType(deleteCustomer),
			mergeMap(({ customerId }) => {
				return from(this.customerService.deleteCustomer(customerId)).pipe(
					map(() => deleteCustomerSuccess({ customerId })),
					catchError((error) => of(deleteCustomerFailure({ error: error.message })))
				);
			})
		)
	);
}
