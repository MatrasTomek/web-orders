import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerState } from '../reducers/customer.reducer';

export const selectCustomerState = createFeatureSelector<CustomerState>('customers');

export const selectAllCustomers = createSelector(selectCustomerState, (state) => state.customers);

export const selectCustomersLoading = createSelector(selectCustomerState, (state) => state.loading);
