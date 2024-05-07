import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
  @Input() activeCustomer: ICustomer | null = null;

  constructor(public modal: ModalService, private customer: CustomerService) {}

  inSubmission: boolean = false;

  showAlert: boolean = false;
  alertMsg: string = 'Proszę czekać, klient jest zapisywany.';
  alertColor: string = 'info';

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

  ngOnInit(): void {
    this.modal.register('customer');
  }

  ngOnChanges() {
    if (!this.activeCustomer) {
      return;
    }

    this.name.setValue(this.activeCustomer.name);
    this.address.setValue(this.activeCustomer.adress);
    this.vat.setValue(this.activeCustomer.vat);
    this.email.setValue(this.activeCustomer.email as string);
    this.phone.setValue(this.activeCustomer.phone as string);
  }

  ngOnDestroy() {
    this.modal.unregister('customer');
  }

  async addCustomer() {
    this.showAlert = true;
    this.alertMsg = 'Proszę czekać, klient jest dodawany.';
    this.alertColor = 'info';
    this.inSubmission = true;

    try {
      await this.customer.createCustomer(this.customerForm.value as ICustomer);
    } catch (e) {
      console.error(e);

      this.alertMsg = 'Taki NIP istnieje w bazie.';
      this.alertColor = 'warning';
      this.inSubmission = false;

      setTimeout(() => {
        this.showAlert = false;
      }, 3000);

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
