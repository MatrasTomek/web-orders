import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import ICustomer from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  public customerCollection: AngularFirestoreCollection<ICustomer>;
  constructor(private db: AngularFirestore) {
    this.customerCollection = db.collection('customers');
  }

  public async createCustomer(customerData: ICustomer) {
    await this.customerCollection.doc().set({
      name: customerData.name,
      adress: customerData.adress,
      vat: customerData.vat,
      email: customerData.email,
      phone: customerData.phone,
    });
  }

  public getCustomers() {
    return new Promise<any>((resolve) => {
      this.customerCollection
        .valueChanges({ idField: 'id' })
        .subscribe((users) => resolve(users));
    });
  }

  public async getCustomer() {}
  public async editCustomer() {}

  //https://angularindepth.com/posts/1441/handling-realtime-data-storage-in-angular-using-firebase-cloud-firestore
}
// https://www.makeuseof.com/store-update-retrieve-data-from-firebase-database-in-angular/
