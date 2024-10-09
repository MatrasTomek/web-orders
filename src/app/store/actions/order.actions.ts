import { createAction, props } from '@ngrx/store';
import { IOrder } from '../../models/order.model';

export const loadOrders = createAction('[Order] Load Orders');
export const loadOrdersSuccess = createAction('[Order] Load Orders Success', props<{ orders: IOrder[] }>());
export const loadOrdersFailure = createAction('[Order] Load Orders Failure', props<{ error: string }>());

export const addOrder = createAction('[Order] Add Order', props<{ Order: IOrder }>());
export const addOrderSuccess = createAction('[Order] Add Order Success', props<{ order: IOrder }>());
export const addOrderFailure = createAction('[Order] Add Order Failure', props<{ error: string }>());

export const editOrder = createAction('[Order] Edit Order', props<{ order: IOrder }>());
export const editOrderSuccess = createAction('[Order] Edit Order Success', props<{ Order: IOrder }>());
export const editOrderFailure = createAction('[Order] Edit Order Failure', props<{ error: string }>());

export const deleteOrder = createAction('[Order] Delete Order', props<{ orderId: string }>());
export const deleteOrderSuccess = createAction('[Order] Delete Order Success', props<{ orderId: string }>());
export const deleteOrderFailure = createAction('[Order] Delete Order Failure', props<{ error: string }>());
