import { Injectable } from '@angular/core';
import IUser from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	public usersCollection: AngularFirestoreCollection<IUser>;
	public isAuthenticated$: Observable<boolean>;
	public isAuthenticatesWithDelay$: Observable<boolean>;
	public docsMode$ = new BehaviorSubject<boolean>(false);

	constructor(
		private auth: AngularFireAuth,
		private db: AngularFirestore,
		private router: Router,
	) {
		this.usersCollection = db.collection('users');
		this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
		this.isAuthenticatesWithDelay$ = this.isAuthenticated$.pipe(delay(1000));
	}

	public async createUser(userData: IUser) {
		if (!userData.password) {
			throw new Error('Password not provided!');
		}
		const userCredential = await this.auth.createUserWithEmailAndPassword(userData.email, userData.password);

		if (!userCredential.user) {
			throw new Error("User can't be found");
		}

		await this.usersCollection.doc(userCredential.user.uid).set({
			name: userData.name,
			email: userData.email,
			phone: userData.phone,
		});

		userCredential.user.updateProfile({
			displayName: userData.name,
		});
	}

	public setDocsMode(value: boolean) {
		this.docsMode$.next(value);
	}

	public async logOut($event: Event) {
		$event.preventDefault();
		this.docsMode$.next(false);
		await this.auth.signOut();
	}
}
