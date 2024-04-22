import { Component, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Table } from 'primeng/table';

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

  allUsers: [] = [];

  async getUsers() {
    this.allUsers = await this.customers.getCustomers();
  }
  openModal($event: Event) {
    $event.preventDefault();
    this.modal.toggleModal('customer');
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
}
