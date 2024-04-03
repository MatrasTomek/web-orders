import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';
import { CustomerService } from '../services/customer.service';
import ICustomer from '../models/customer.model';

@Component({
  selector: 'app-add-customer-modal',
  templateUrl: './add-customer-modal.component.html',
  styleUrls: ['./add-customer-modal.component.scss'],
})
export class AddCustomerModalComponent implements OnInit, OnDestroy {
  constructor(public modal: ModalService, private customer: CustomerService) {}

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
    this.alertMsg = 'Proszę czekać, klient jest dodawany.';
    this.alertColor = 'info';
    this.inSubmission = true;

    try {
      await this.customer.createCustomer(this.customerForm.value as ICustomer);
    } catch (e) {
      console.error(e);

      this.alertMsg = 'Niespodziewany błąd, sprópuj później.';
      this.alertColor = 'warning';
      this.inSubmission = false;

      return;
    }

    this.alertMsg = 'Sukces! Klient dodany.';
    this.alertColor = 'success';
    this.closeModal('close');

    setTimeout(() => {
      this.showAlert = false;
    }, 2500);
  }

  closeModal($event: any) {
    this.modal.toggleModal('customer');
  }
}
