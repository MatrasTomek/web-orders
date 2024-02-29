import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';
import { AuthService } from '../services/auth.service';
import IUser from '../models/user.model';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
})
export class RegisterModalComponent implements OnInit, OnDestroy {
  constructor(public modal: ModalService, private auth: AuthService) {}

  inSubmission: boolean = false;

  showAlert: boolean = false;
  alertMsg: string = 'Proszę czekać, konto jest tworzone.';
  alertColor: string = 'info';

  ngOnInit(): void {
    this.modal.register('auth');
  }

  ngOnDestroy(): void {
    this.modal.unregister('auth');
  }

  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  phone = new FormControl('', [Validators.required, Validators.minLength(9)]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  confirm_password = new FormControl('', [Validators.required]);

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    phone: this.phone,
    password: this.password,
    confirm_password: this.confirm_password,
  });

  async register() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      this.auth.createUser(this.registerForm.value as IUser);
    } catch (error) {
      console.error(error);
      this.alertMsg = 'Niespodziewany błąd, sprópuj później';
      this.alertColor = 'warning';
      this.inSubmission = false;

      return;
    }

    this.alertMsg = 'Sukces! Twoje konto zostało utworzone';
    this.alertColor = 'success';
  }
}
