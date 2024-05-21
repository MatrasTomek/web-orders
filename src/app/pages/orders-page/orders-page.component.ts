import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import IOrder from 'src/app/models/order.model';
import { ModalService } from 'src/app/services/modal.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss'],
})
export class OrdersPageComponent {
  @ViewChild('ordersTb') customersTable!: Table;

  constructor(public modal: ModalService, public orders: OrderService) {
    this.getOrders();
  }

  allOrders: any = [];
  activeOrder: IOrder | null = null;
  confirmationMessage: string = '';

  async getOrders() {
    this.allOrders = await this.orders.getOrders();
  }

  openAddModal($event: Event) {
    $event.preventDefault();
    this.modal.toggleModal('addCustomer');
  }

  handleInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.value != null) {
      this.customersTable.filterGlobal(inputElement.value, 'contains');
    }
  }

  clear(table: Table) {
    table.clear();
  }

  // editCustomer($event: Event, customer: IOrder) {
  //   $event.preventDefault();

  //   this.activeCustomer = customer;
  //   this.modal.toggleModal('editCustomer');
  // }

  addUpdate($event: IOrder) {
    return this.allOrders.unshift($event);
  }

  editUpdate($event: IOrder) {
    this.allOrders.forEach((item: { id: any }, index: any) => {
      if (item.id === $event.id) {
        this.allOrders[index] = $event;
      }
    });
  }

  // openConfirmationModal($event: Event, customer: IOrder) {
  //   $event.preventDefault();

  //   this.confirmationMessage = `Czy chesz usunąć klienta: ${customer.name} ?`;
  //   this.activeCustomer = customer;
  //   this.modal.toggleModal('confirmationModal');
  // }

  // deleteConfirmed($event: any) {
  //   this.customers.deleteCustomer($event);

  //   this.allOrders.forEach((item: { id: any }, index: any) => {
  //     if (item.id === $event.id) {
  //       this.allOrders.splice(index, 1);
  //     }
  //   });
  // }

  // Temporary fn to get customer by vat
  // async take($event: Event) {
  //   $event.preventDefault();

  //   const user = await this.customers.getCustomer('PL8691491653');

  //   console.log(user);
  // }
}
