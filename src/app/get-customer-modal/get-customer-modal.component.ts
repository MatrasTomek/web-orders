import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { CustomerService } from '../services/customer.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import ICustomer from '../models/customer.model';

@Component({
  selector: 'app-get-customer-modal',
  templateUrl: './get-customer-modal.component.html',
  styleUrls: ['./get-customer-modal.component.scss'],
})
export class GetCustomerModalComponent {
  @Input() kindOfCustomer?: 'client' | 'carrier' | null = null;
  @Output() getUpdate = new EventEmitter();

  inSubmission: boolean = false;

  showAlert: boolean = false;
  alertMsg: string = 'Proszę czekać, klient jest wyszukiwany.';
  alertColor: string = 'info';

  customerItem: ICustomer[] = [];

  vat = new FormControl('', [Validators.required, Validators.minLength(10)]);

  getCustomerForm = new FormGroup({
    vat: this.vat,
  });

  constructor(public modal: ModalService, private customer: CustomerService) {}

  ngOnInit(): void {
    this.modal.register('getCustomer');
  }

  ngOnChanges() {
    this.inSubmission = false;
    this.showAlert = false;
  }

  ngOnDestroy() {
    this.modal.unregister('getCustomer');
  }

  async getCustomer() {
    this.showAlert = true;
    this.alertMsg = 'Proszę czekać, klient jest wyszukiwany.';
    this.alertColor = 'info';
    this.inSubmission = true;

    try {
      this.customerItem = await this.customer.getCustomer(
        this.getCustomerForm.value.vat as string
      );
      if (this.customerItem.length === 0) {
        this.alertMsg = `Nie ma klienta z Nip: ${this.getCustomerForm.value.vat}.`;
        this.alertColor = 'warning';
        this.inSubmission = false;

        setTimeout(() => {
          this.showAlert = false;
        }, 4500);
      } else {
        this.getUpdate.emit(
          !this.kindOfCustomer
            ? this.customerItem[0]
            : {
                kindOfCustomer: this.kindOfCustomer,
                customer: this.customerItem[0],
              }
        );
        this.showAlert = false;
        this.closeModal('close');
      }
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
  }

  closeModal($event: any) {
    this.modal.toggleModal('getCustomer');
  }
}
