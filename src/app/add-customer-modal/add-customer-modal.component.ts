import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-add-customer-modal',
  templateUrl: './add-customer-modal.component.html',
  styleUrls: ['./add-customer-modal.component.scss'],
})
export class AddCustomerModalComponent implements OnInit, OnDestroy {
  constructor(public modal: ModalService) {}

  inSubmission: boolean = false;

  showAlert: boolean = false;
  alertMsg: string = 'Proszę czekać, klient jest zapisywany.';
  alertColor: string = 'info';

  ngOnInit(): void {
    this.modal.register('customer');
  }

  ngOnDestroy(): void {
    this.modal.unregister('customer');
  }

  name = new FormControl('', [Validators.required, Validators.minLength(3)]);

  address = new FormControl('', [Validators.required, Validators.minLength(3)]);

  vat = new FormControl('', [Validators.required, Validators.minLength(10)]);

  email = new FormControl('', [Validators.email]);

  phone = new FormControl('', [Validators.minLength(9)]);

  customerForm = new FormGroup({
    name: this.name,
    adress: this.address,
    vat: this.vat,
    email: this.email,
    phone: this.phone,
  });

  async addCustomer() {
    this.showAlert = true;
    this.alertMsg = 'Proszę czekać, klient jest zapisywany.';
    this.alertColor = 'info';
  }

  closeModal($event: Event) {
    this.modal.toggleModal('customer');
  }
}
