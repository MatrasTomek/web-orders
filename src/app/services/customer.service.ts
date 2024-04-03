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

  public async getCustomers() {}
  public async getCustomer() {}
  public async editCustomer() {}

  //https://angularindepth.com/posts/1441/handling-realtime-data-storage-in-angular-using-firebase-cloud-firestore
}
