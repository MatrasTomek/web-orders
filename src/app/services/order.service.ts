import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { IOrder } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  public orderCollection: AngularFirestoreCollection<IOrder>;
  constructor(private db: AngularFirestore) {
    this.orderCollection = db.collection('orders');
  }

  public getOrders() {
    return new Promise<any>((resolve) => {
      this.orderCollection
        .valueChanges({ idField: 'id' })
        .subscribe((orders) => resolve(orders));
    });
  }

  createOrder(
    orderData: IOrder
  ): Promise<DocumentReference<IOrder>> {

    return this.orderCollection.add(orderData);
  }
}
