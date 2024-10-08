import { createReducer, on } from '@ngrx/store';
import {
	loadCustomers,
	loadCustomersSuccess,
	loadCustomersFailure,
	addCustomer,
	addCustomerSuccess,
	addCustomerFailure,
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
		customers: [...state.customers, customer],
		loading: false,
	})),
	on(addCustomerFailure, (state, { error }) => ({ ...state, error, loading: false }))
);