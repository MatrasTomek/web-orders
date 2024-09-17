import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { IOrder } from 'src/app/models/order.model';
import { ModalService } from 'src/app/services/modal.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss'],
})
export class OrdersPageComponent implements OnInit {
  @ViewChild('ordersTb') ordersTable!: Table;

  constructor(public modal: ModalService, public orders: OrderService, private router: Router) {}

  allOrders: any = [] = [];
  cols: any[] = [];
  selectedColumns: any[] = [];
  activeOrder: IOrder | null = null;
  confirmationMessage: string = '';
  fieldsArray: string[] = [];


  async ngOnInit() {
    this.allOrders = await this.orders.getOrders();

    this.cols = [
      { field: 'carrierDetails.name', header: 'Nazwa prewoźnika' },
      { field: 'carrierDetails.adress', header: 'Adres prewoźnika' },
      { field: 'carrierDetails.phone', header: 'Telefon prewoźnika' },
      { field: 'carrierDetails.vat', header: 'VAT prewoźnika' },
      { field: 'carrierDetails.email', header: 'eMail prewoźnika' },
      { field: 'clientDetails.name', header: 'Nazwa klienta' },
      { field: 'clientDetails.adress', header: 'Adres klienta' },
      { field: 'clientDetails.phone', header: 'Telefon klienta' },
      { field: 'clientDetails.vat', header: 'VAT klienta' },
      { field: 'clientDetails.email', header: 'eMail klienta' },
      { field: 'orderDetails.loadDate.seconds', header: 'Data załadunku' },
      { field: 'orderDetails.loadPlace', header: 'Miejsce załadunku' },
      { field: 'orderDetails.loadAddress', header: 'Adres załadunku' },
      { field: 'orderDetails.unloadDate.seconds', header: 'Data rozładunku' },
      { field: 'orderDetails.unloadPlace', header: 'Miejsce rozładunku' },
      { field: 'orderDetails.unloadAddress', header: 'Adres rozładunku' },
      { field: 'orderDetails.dimension', header: 'Ilość' },
      { field: 'orderDetails.weight', header: 'Waga' },
      { field: 'orderDetails.goods', header: 'Towar' },
      { field: 'orderDetails.driver', header: 'Kierowca' },
      { field: 'orderDetails.truck', header: 'Samochód' },
      { field: 'conditions.isAdr', header: 'ADR' },
      { field: 'conditions.adrDetails', header: 'Adr wymagania' },
      { field: 'conditions.isFrigo', header: 'Chłodnia' },
      { field: 'conditions.frigoDetails', header: 'Chłodnia wymagania' },
      { field: 'conditions.isFixed', header: 'FIX' },
      { field: 'conditions.fixDetails', header: 'Czas tranzytu' },
      { field: 'conditions.customerFreight', header: 'Fracht klienta' },
      { field: 'conditions.customerTerm', header: 'Termin klienta' },
      { field: 'conditions.carrierFreight', header: 'Fracht przewoźnika' },
      { field: 'conditions.carrierTerm', header: 'Termin przewoźnika' },
      { field: 'conditions.description', header: 'Dodatkowy opis' },

    ];

    this.selectedColumns = this.cols;

    this.fieldsArray = this.cols.map(col => col.field);
  }


  openAddModal($event: Event) {
    $event.preventDefault();
    this.modal.toggleModal('addCustomer');
  }

  handleInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.value != null) {
      this.ordersTable.filterGlobal(inputElement.value, 'contains');
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

  goToAddOrder(order: IOrder){
    const orderParse = {
      clientDetails: JSON.stringify(order.clientDetails),  // Serializowanie obiektów do JSON
      carrierDetails: JSON.stringify(order.carrierDetails),
      orderDetails: JSON.stringify(order.orderDetails),
      conditions: JSON.stringify(order.conditions),
      id: order.id
    };

    this.router.navigate(['/add-order'], { queryParams: orderParse });
  }

  openConfirmationModal($event: Event, order: IOrder) {
    $event.preventDefault();

    this.confirmationMessage = `Czy chesz usunąć zlecenie: ${'test'} ?`;
    this.activeOrder = order;
    this.modal.toggleModal('confirmationModal');
  }

  deleteConfirmed($event: any) {
    this.orders.deleteOrder($event);

    this.allOrders.forEach((item: { id: any }, index: any) => {
      if (item.id === $event.id) {
        this.allOrders.splice(index, 1);
      }
    });
  }

  // Temporary fn to get customer by vat
  // async take($event: Event) {
  //   $event.preventDefault();

  //   const user = await this.customers.getCustomer('PL8691491653');

  //   console.log(user);
  // }
  resolveField(obj: any, path: string) {
    return path.split('.').reduce((o, i) => (o ? o[i] : null), obj);
  }
}
