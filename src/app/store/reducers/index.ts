import { ActionReducerMap } from '@ngrx/store';
import { customerReducer, CustomerState } from './customer.reducer';
import { orderReducer, OrderState } from './order.reducer';

export interface AppState {
	customers: CustomerState;
	orders: OrderState;
}

export const reducers: ActionReducerMap<AppState> = {
	customers: customerReducer,
	orders: orderReducer,
};
