import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-login-modal',
	templateUrl: './login-modal.component.html',
	styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnInit, OnDestroy {
	credentials = { email: '', password: '' };
	inSubmission = false;
	showAlert = false;
	alertMsg = '';
	alertColor = 'info';

	constructor(
		public modal: ModalService,
		private fireAuth: AngularFireAuth,
		private auth: AuthService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.modal.register('docsLogin');
	}

	ngOnDestroy(): void {
		this.modal.unregister('docsLogin');
	}

	async login() {
		this.showAlert = true;
		this.alertMsg = 'Proszę czekać, logowanie trwa...';
		this.alertColor = 'info';
		this.inSubmission = true;

		try {
			await this.fireAuth.signInWithEmailAndPassword(this.credentials.email, this.credentials.password);
			this.auth.setDocsMode(true);
			this.modal.toggleModal('docsLogin');
			this.router.navigateByUrl('/docs');
		} catch (e) {
			this.alertMsg = 'Błędny login lub hasło.';
			this.alertColor = 'warning';
			this.inSubmission = false;
		}
	}
}
