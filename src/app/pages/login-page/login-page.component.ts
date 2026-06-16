import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-login-page',
	templateUrl: './login-page.component.html',
	styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
	credentials = {
		email: '',
		password: '',
	};

	inSubmission: boolean = false;

	showAlert: boolean = false;
	alertMsg: string = 'Proszę czekać, logowanie trwa...';
	alertColor: string = 'info';

	constructor(
		private fireAuth: AngularFireAuth,
		private auth: AuthService,
	) {}

	async login() {
		this.showAlert = true;
		this.alertMsg = 'Proszę czekać, logowanie trwa...';
		this.alertColor = 'info';
		this.inSubmission = true;
		try {
			const userCredential = await this.fireAuth.signInWithEmailAndPassword(this.credentials.email, this.credentials.password);
			if (userCredential.user) {
				const userData = await this.auth.getUserData(userCredential.user.uid);
				if (userData?.docsOnly) {
					await this.fireAuth.signOut();
					this.alertMsg = 'Ten użytkownik ma dostęp tylko do dokumentów.';
					this.alertColor = 'warning';
					this.inSubmission = false;
					return;
				}
			}
		} catch (e) {
			console.error(e);
			this.alertMsg = 'Błędny login lub hasło.';
			this.alertColor = 'warning';
			this.inSubmission = false;
			return;
		}
	}
}
