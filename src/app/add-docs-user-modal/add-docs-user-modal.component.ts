import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-add-docs-user-modal',
  templateUrl: './add-docs-user-modal.component.html',
  styleUrls: ['./add-docs-user-modal.component.scss'],
})
export class AddDocsUserModalComponent implements OnInit, OnDestroy {
  constructor(
    public modal: ModalService,
    private auth: AuthService,
  ) {}

  inSubmission = false;
  showAlert = false;
  alertMsg = '';
  alertColor = 'info';

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);

  docsUserForm = new FormGroup({
    email: this.email,
    password: this.password,
  });

  ngOnInit(): void {
    this.modal.register('addDocsUser');
  }

  ngOnDestroy(): void {
    this.modal.unregister('addDocsUser');
  }

  async addUser() {
    this.showAlert = true;
    this.alertMsg = 'Proszę czekać, tworzenie użytkownika...';
    this.alertColor = 'info';
    this.inSubmission = true;

    try {
      await this.auth.createDocsUser(this.email.value!, this.password.value!);
      this.alertMsg = 'Użytkownik do dokumentów został utworzony.';
      this.alertColor = 'success';
      this.docsUserForm.reset();
    } catch (e: any) {
      const msg = e?.code === 'auth/email-already-in-use'
        ? 'Ten email jest już zarejestrowany.'
        : 'Błąd podczas tworzenia użytkownika.';
      this.alertMsg = msg;
      this.alertColor = 'warning';
    } finally {
      this.inSubmission = false;
    }
  }
}
