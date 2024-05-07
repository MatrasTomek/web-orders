import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import ICustomer from '../models/customer.model';
import { firstValueFrom, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  public customerCollection: AngularFirestoreCollection<ICustomer>;
  constructor(private db: AngularFirestore) {
    this.customerCollection = db.collection('customers');
  }

  createCustomer(
    customerData: ICustomer
  ): Promise<DocumentReference<ICustomer>> {
    // const clientExists = await firstValueFrom(
    //   this.checkIfCustomerExistByVat(customerData)
    // );

    // if (clientExists) {
    //   throw Error;
    // }

    this.checkIfCustomerExistByVat(customerData);

    // return this.customerCollection.add(customerData);

    throw Error;
  }

  private extractDigits(vat: string): string {
    return vat.replace(/\D/g, '');
  }

  checkIfCustomerExistByVat(customerData: ICustomer) {
    const vatDigits = this.extractDigits(customerData.vat);

    console.log(vatDigits);

    const query = this.customerCollection.ref.where('vat', '==', vatDigits);
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
