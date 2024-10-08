import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
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

	createCustomer(customerData: ICustomer): Promise<DocumentReference<ICustomer>> {
		// const clientExists = await firstValueFrom(
		//   this.checkIfCustomerExistByVat(customerData)
		// );

		// if (clientExists) {
		//   throw Error;
		// }

		// this.checkIfCustomerExistByVat(customerData);

		return this.customerCollection.add(customerData);
	}

	private extractDigits(vat: string): string {
		return vat.replace(/\D/g, '');
	}

	async checkIfCustomerExistByVat(customerData: ICustomer) {
		const vatWithoutCountry = this.extractDigits(customerData.vat);
	}

	public getCustomers() {
		return new Promise<any>((resolve) => {
			this.customerCollection.valueChanges({ idField: 'id' }).subscribe((users) => resolve(users));
		});
	}

	public async editCustomer(id: string, customer: ICustomer) {
		return this.customerCollection.doc(id).update({
			adress: customer.adress,
			email: customer.email,
			name: customer.name,
			phone: customer.phone,
			vat: customer.vat,
		});
	}

	// Temporaty fn to gest customer by vat
	public async getCustomer(vat: string) {
		const user1 = await this.db.collection('customers', (ref) => ref.where('vat', '==', vat));

		const user2 = await this.db.collection('customers', (ref) => ref.where('vat', '==', this.extractDigits(vat)));

		return new Promise<any>((resolve) => {
			user1.valueChanges().subscribe((user) => resolve(user));
		});
	}

	public async deleteCustomer(customer: ICustomer) {
		this.customerCollection.doc(customer.id).delete();
	}

	//https://angularindepth.com/posts/1441/handling-realtime-data-storage-in-angular-using-firebase-cloud-firestore
}
// https://www.makeuseof.com/store-update-retrieve-data-from-firebase-database-in-angular/
