
import { Component, OnInit,  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { IOrder } from 'src/app/models/order.model';


import { ModalService } from 'src/app/services/modal.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-add-order-page',
  templateUrl: './add-order-page.component.html',
  styleUrls: ['./add-order-page.component.scss'],
})
export class AddOrderPageComponent implements OnInit {
  items: MenuItem[] = [];
  activeIndex: number = 0;

  constructor(public modal: ModalService, private orderItem: OrderService) {}

  //form
  inSubmission: boolean = false;
  showAlert = false;
  alertMsg = 'Proszę czekać, klient jest dodawany.';
  alertColor = 'info';
  confirmationMessage: string = '';
  order: boolean = false;

  //clients
  client: any = null;
  carrier: any = null;
  kindOfCustomer?: 'client' | 'carrier' | null;

  //loads
  loadDate = new FormControl('', [Validators.required]);
  loadPlace = new FormControl('', [Validators.required]);
  loadAddress = new FormControl('', [Validators.required]);

  unloadDate = new FormControl('', [Validators.required]);
  unloadPlace = new FormControl('', [Validators.required]);
  unloadAddress = new FormControl('', [Validators.required]);

  driver = new FormControl('');
  truck = new FormControl('');

  goods = new FormControl('');
  dimension = new FormControl('');
  weight = new FormControl('');

  orderForm = new FormGroup({
    loadDate: this.loadDate,
    loadPlace: this.loadPlace,
    loadAddress: this.loadAddress,
    unloadDate: this.unloadDate,
    unloadPlace: this.unloadPlace,
    unloadAddress: this.unloadAddress,
    driver: this.driver,
    truck: this.truck,
    goods: this.goods,
    dimension: this.dimension,
    weight: this.weight,
  });

  //conditions
  isFixed = new FormControl<boolean>(false);
  fixDetails = new FormControl('');
  isAdr = new FormControl<boolean>(false);
  adrDetails = new FormControl('');
  isFrigo = new FormControl<boolean>(false);
  frigoDetails = new FormControl('');
  customerTerm = new FormControl('', [Validators.required]);
  customerFreight = new FormControl('', [Validators.required]);
  carrierTerm = new FormControl('', [Validators.required]);
  carrierFreight = new FormControl('', [Validators.required]);
  description = new FormControl('');

  conditionForm = new FormGroup({
    isFixed: this.isFixed,
    fixDetails: this.fixDetails,
    isAdr: this.isAdr,
    adrDetails: this.adrDetails,
    isFrigo: this.isFrigo,
    frigoDetails: this.frigoDetails,
    customerTerm: this.customerTerm,
    customerFreight: this.customerFreight,
    carrierTerm: this.carrierTerm,
    carrierFreight: this.carrierFreight,
    description: this.description,
  });

  onActiveIndexChange($event: number) {
    this.activeIndex = $event;
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Klient | Przewoźnik',
        // command: (event: any) => this.messageService.add({severity:'info', summary:'First Step', detail: event.item.label})
      },
      {
        label: 'Dane zlecenia',
        // command: (event: any) => this.messageService.add({severity:'info', summary:'Second Step', detail: event.item.label})
      },
      {
        label: 'Warunki zlecenia',
        // command: (event: any) => this.messageService.add({severity:'info', summary:'Third Step', detail: event.item.label})
      },
    ];
  }

  getCustomer($event: any, kindOfCustomer: 'client' | 'carrier' | null) {
    $event.preventDefault();
    this.kindOfCustomer = kindOfCustomer;
    this.modal.toggleModal('getCustomer');
  }

  addCustomer($event: any, kindOfCustomer: 'client' | 'carrier' | null) {
    $event.preventDefault();
    this.kindOfCustomer = kindOfCustomer;
    this.modal.toggleModal('addCustomer');
  }

  addUpdate($event: any) {
    if (!$event.kindOfCustomer) {
      return;
    }

    if ($event.kindOfCustomer === 'client') {
      this.client = $event.customer;
    } else {
      this.carrier = $event.customer;
    }
  }

  addOrder() {
    this.activeIndex = 2;
    this.order = true;
  }

  resetForm($event: any, formType: string) {
    switch (formType) {
      case 'customer':
        this.client = null;
        this.carrier = null;
        break;
      case 'order':
        this.orderForm.reset();
        break;
      case 'conditions':
        this.conditionForm.reset();
        break;
      default:
        console.log('Nieznana wartość');
    }

    // $event.preventDefault();
    // this.confirmationMessage = `Czy chcesz wyczyścić dane ?`;
    // this.modal.toggleModal('confirmationModal');
  }

  async acceptAllForm() {

    this.showAlert = true;
    this.alertMsg = 'Proszę czekać, klient jest dodawany.';
    this.alertColor = 'info';
    this.inSubmission = true;

    const completeOrder = {
      clientDetails: this.client,
      carrierDetails: this.carrier,
      orderDetails: this.orderForm.value,
      conditions: this.conditionForm.value
    }

    try {
      await this.orderItem.createOrder(completeOrder as IOrder);
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

// Tutaj trezba dodać zlecenie do tabeli - prezkazać do orders-page lub do state

// trezba tez dodac przechodzenie do orders-page

    this.alertMsg = 'Sukces! Klient dodany.';
    this.alertColor = 'success';
    this.inSubmission = false;

    setTimeout(() => {
      this.showAlert = false;
    }, 2500);
  }

}
