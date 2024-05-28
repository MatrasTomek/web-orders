import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
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
  @Input() kindOfCustomer?: 'client' | 'carrier' | null = null;
  @Output() addUpdate = new EventEmitter();

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
    this.modal.register('addCustomer');
  }

  ngOnChanges() {
    if (!this.activeCustomer) {
      return;
    }
  }

  ngOnDestroy() {
    this.modal.unregister('addCustomer');
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

      this.alertMsg = 'Cos poszło nie tak, spróbuj jeszcze raz za chwilę.';
      this.alertColor = 'warning';
      this.inSubmission = false;

      setTimeout(() => {
        this.showAlert = false;
      }, 3000);

      return;
    }

    this.addUpdate.emit(
      !this.kindOfCustomer
        ? (this.customerForm.value as ICustomer)
        : {
            kindOfCustomer: this.kindOfCustomer,
            customer: this.customerForm.value as ICustomer,
          }
    );

    this.alertMsg = 'Sukces! Klient dodany.';
    this.alertColor = 'success';
    this.closeModal('close');

    setTimeout(() => {
      this.showAlert = false;
    }, 2500);
  }

  closeModal($event: any) {
    this.modal.toggleModal('addCustomer');
  }
}
