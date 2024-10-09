import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { OrderService } from '../../services/order.service';
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
import { Injectable } from '@angular/core';
import ICustomer from 'src/app/models/customer.model';
import { IOrder } from 'src/app/models/order.model';

@Injectable()
export class OrderEffects {
	constructor(private actions$: Actions, private orderService: OrderService) {}

	loadOrders$ = createEffect(() =>
		this.actions$.pipe(
			ofType(loadOrders),
			mergeMap(() =>
				from(this.orderService.getOrders()).pipe(
					map((orders) => loadOrdersSuccess({ orders })),
					catchError((error) => of(loadOrdersFailure({ error: error.message })))
				)
			)
		)
	);

	addOrder$ = createEffect(() =>
		this.actions$.pipe(
			ofType(addOrder),
			mergeMap(({ Order }) =>
				this.orderService.createOrder(Order).then((docRef) =>
					docRef.get().then((doc) => {
						const newOrder = { id: docRef.id, ...doc.data() } as IOrder;
						return addOrderSuccess({ order: newOrder });
					})
				)
			)
		)
	);

	// editOrder$ = createEffect(() =>
	// 	this.actions$.pipe(
	// 		ofType(editOrder),
	// 		mergeMap(({ order }) => {
	// 			return from(this.orderService.editOrder(order.id!, order)).pipe(
	// 				map(() => editOrderSuccess({ order: IOrder })),
	// 				catchError((error) => of(editOrderFailure({ error: error.message })))
	// 			);
	// 		})
	// 	)
	// );

	// deleteOrder$ = createEffect(() =>
	// 	this.actions$.pipe(
	// 		ofType(deleteOrder),
	// 		mergeMap(({ orderId }) => {
	// 			return from(this.orderService.deleteOrder(orderId)).pipe(
	// 				map(() => deleteOrderSuccess({ orderId })),
	// 				catchError((error) => of(deleteOrderFailure({ error: error.message })))
	// 			);
	// 		})
	// 	)
	// );
}
