import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import IOrder from 'src/app/models/order.model';

import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-add-order-page',
  templateUrl: './add-order-page.component.html',
  styleUrls: ['./add-order-page.component.scss'],
})
export class AddOrderPageComponent implements OnInit {
  items: MenuItem[] = [];
  activeIndex: number = 0;

  constructor(public modal: ModalService) {}

  //form
  inSubmission: boolean = false;

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
    // unloadDate: this.unloadDate,
    unloadPlace: this.unloadPlace,
    unloadAddress: this.unloadAddress,
    driver: this.driver,
    truck: this.truck,
    goods: this.goods,
    dimension: this.dimension,
    weight: this.weight,
  });

  //conditions

  customerTerm = new FormControl('', [Validators.required]);
  customerFreight = new FormControl('', [Validators.required]);
  carrierTerm = new FormControl('', [Validators.required]);
  carrierFreight = new FormControl('', [Validators.required]);
  description = new FormControl('', [Validators.required]);

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

    console.log($event.customer);

    if ($event.kindOfCustomer === 'client') {
      this.client = $event.customer;
    } else {
      this.carrier = $event.customer;
    }
  }

  addOrder() {}

  acceptAllForm() {}
}
