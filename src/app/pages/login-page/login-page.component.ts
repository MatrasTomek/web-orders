import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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

  constructor(private auth: AngularFireAuth) {}

  async login() {
    this.showAlert = true;
    this.alertMsg = 'Proszę czekać, logowanie trwa...';
    this.alertColor = 'info';
    this.inSubmission = true;
    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );
    } catch (e) {
      console.error(e);

      this.alertMsg = 'Błędny login lub hasło.';
      this.alertColor = 'warning';
      this.inSubmission = false;

      return;
    }
  }
}
