import { ActionReducerMap } from '@ngrx/store';
import { customerReducer, CustomerState } from './customer.reducer';

export interface AppState {
	customers: CustomerState;
}

export const reducers: ActionReducerMap<AppState> = {
	customers: customerReducer,
};
