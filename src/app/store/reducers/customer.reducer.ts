import { createReducer, on } from '@ngrx/store';
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
import ICustomer from '../../models/customer.model';

export interface CustomerState {
	customers: ICustomer[];
	error: string | null;
	loading: boolean;
}

export const initialState: CustomerState = {
	customers: [],
	error: null,
	loading: false,
};

export const customerReducer = createReducer(
	initialState,
	on(loadCustomers, (state) => ({ ...state, loading: true })),
	on(loadCustomersSuccess, (state, { customers }) => ({ ...state, customers, loading: false })),
	on(loadCustomersFailure, (state, { error }) => ({ ...state, error, loading: false })),
	on(addCustomer, (state) => ({ ...state, loading: true })),
	on(addCustomerSuccess, (state, { customer }) => ({
		...state,
		customers: [customer, ...state.customers],
		loading: false,
	})),
	on(addCustomerFailure, (state, { error }) => ({ ...state, error, loading: false })),
	on(editCustomer, (state) => ({ ...state, loading: true })),
	on(editCustomerSuccess, (state, { customer }) => ({
		...state,
		customers: state.customers.map((c) => (c.id === customer.id ? customer : c)),
		loading: false,
	})),
	on(editCustomerFailure, (state, { error }) => ({ ...state, error, loading: false })),
	on(deleteCustomer, (state) => ({ ...state, loading: true })),
	on(deleteCustomerSuccess, (state, { customerId }) => ({
		...state,
		customers: state.customers.filter((c) => c.id !== customerId),
		loading: false,
	})),
	on(deleteCustomerFailure, (state, { error }) => ({ ...state, error, loading: false }))
);
