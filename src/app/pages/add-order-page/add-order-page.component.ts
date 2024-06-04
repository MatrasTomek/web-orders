import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import ICustomer from 'src/app/models/customer.model';
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

  client: any = null;
  carrier: any = null;
  kindOfCustomer?: 'client' | 'carrier' | null;

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
}
