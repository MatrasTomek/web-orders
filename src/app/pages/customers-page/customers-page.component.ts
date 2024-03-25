import { Component } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-customers-page',
  templateUrl: './customers-page.component.html',
  styleUrls: ['./customers-page.component.scss'],
})
export class CustomersPageComponent {
  constructor(public modal: ModalService) {}

  openModal($event: Event) {
    $event.preventDefault();
    this.modal.toggleModal('customer');
  }
}
