import { createReducer, on } from '@ngrx/store';
import {
	loadOrders,
	loadOrdersSuccess,
	loadOrdersFailure,
	addOrder,
	addOrderSuccess,
	addOrderFailure,
	editOrder,
	editOrderSuccess,
	editOrderFailure,
	deleteOrder,
	deleteOrderSuccess,
	deleteOrderFailure,
} from '../actions/order.actions';
import { IOrder } from '../../models/order.model';

export interface OrderState {
	orders: IOrder[];
	error: string | null;
	loading: boolean;
}

export const initialState: OrderState = {
	orders: [],
	error: null,
	loading: false,
};

export const orderReducer = createReducer(
	initialState,
	on(loadOrders, (state) => ({ ...state, loading: true })),
	on(loadOrdersSuccess, (state, { orders }) => ({ ...state, orders, loading: false })),
	on(loadOrdersFailure, (state, { error }) => ({ ...state, error, loading: false })),
	on(addOrder, (state) => ({ ...state, loading: true })),
	on(addOrderSuccess, (state, { order }) => ({
		...state,
		orders: [...state.orders, order],
		loading: false,
	})),
	on(addOrderFailure, (state, { error }) => ({ ...state, error, loading: false })),
	on(editOrder, (state) => ({ ...state, loading: true })),
	on(editOrderSuccess, (state, { Order }) => ({
		...state,
		orders: state.orders.map((c) => (c.id === Order.id ? Order : c)),
		loading: false,
	})),
	on(editOrderFailure, (state, { error }) => ({ ...state, error, loading: false })),
	on(deleteOrder, (state) => ({ ...state, loading: true })),
	on(deleteOrderSuccess, (state, { orderId }) => ({
		...state,
		orders: state.orders.filter((c) => c.id !== orderId),
		loading: false,
	})),
	on(deleteOrderFailure, (state, { error }) => ({ ...state, error, loading: false }))
);
