import { ActionReducerMap } from '@ngrx/store';
import { customerReducer, CustomerState } from './customer.reducer';
import { orderReducer, OrderState } from './order.reducer';
import { spinnerReducer } from './spinner.reducer';

export type SpinnerState = boolean;
export interface AppState {
	customers: CustomerState;
	orders: OrderState;
	spinner: SpinnerState;
}

export const reducers: ActionReducerMap<AppState> = {
	customers: customerReducer,
	orders: orderReducer,
	spinner: spinnerReducer,
};
