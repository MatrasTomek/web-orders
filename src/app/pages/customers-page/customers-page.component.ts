import { Component, Input, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Table } from 'primeng/table';
import ICustomer from 'src/app/models/customer.model';

@Component({
  selector: 'app-customers-page',
  templateUrl: './customers-page.component.html',
  styleUrls: ['./customers-page.component.scss'],
})
export class CustomersPageComponent {
  @ViewChild('customersTb') customersTable!: Table;

  constructor(public modal: ModalService, public customers: CustomerService) {
    this.getUsers();
  }

  allUsers: any = [];
  activeCustomer: ICustomer | null = null;

  async getUsers() {
    this.allUsers = await this.customers.getCustomers();
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

  editCustomer($event: Event, customer: ICustomer) {
    $event.preventDefault();

    this.activeCustomer = customer;
    this.modal.toggleModal('editCustomer');
  }

  addUpdate($event: ICustomer) {
    return this.allUsers.unshift($event);
  }

  editUpdate($event: ICustomer) {
    this.allUsers.forEach((item: { id: any }, index: any) => {
      if (item.id === $event.id) {
        this.allUsers[index] = $event;
      }
    });
  }
}
