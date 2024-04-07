import { Component } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-customers-page',
  templateUrl: './customers-page.component.html',
  styleUrls: ['./customers-page.component.scss'],
})
export class CustomersPageComponent {
  constructor(public modal: ModalService, public customers: CustomerService) {
    this.getUsers();
  }

  allUsers: any;

  async getUsers() {
    this.allUsers = await this.customers.getCustomers();
    console.log(this.allUsers);
  }
  openModal($event: Event) {
    $event.preventDefault();
    this.modal.toggleModal('customer');
  }

  clear(table: Table) {
    table.clear();
  }
}
