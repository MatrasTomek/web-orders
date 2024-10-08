import { createAction, props } from '@ngrx/store';
import ICustomer from '../../models/customer.model';

export const loadCustomers = createAction('[Customer] Load Customers');
export const loadCustomersSuccess = createAction('[Customer] Load Customers Success', props<{ customers: ICustomer[] }>());
export const loadCustomersFailure = createAction('[Customer] Load Customers Failure', props<{ error: string }>());

export const addCustomer = createAction('[Customer] Add Customer', props<{ customer: ICustomer }>());
export const addCustomerSuccess = createAction('[Customer] Add Customer Success', props<{ customer: ICustomer }>());
export const addCustomerFailure = createAction('[Customer] Add Customer Failure', props<{ error: string }>());
