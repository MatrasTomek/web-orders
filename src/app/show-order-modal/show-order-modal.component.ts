import { Component, Input } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { IOrder } from '../models/order.model';

@Component({
  selector: 'app-show-order-modal',
  templateUrl: 'show-order-modal.component.html',
  styleUrls: ['show-order-modal.component.scss']
})
export class ShowOrderModalComponent {
@Input() activeOrder: IOrder | null = null



  constructor(public modal: ModalService) {}

  ngOnInit(): void {
    this.modal.register('showOrder');

  }

  ngOnChanges() {
    if (!this.activeOrder) {
      return;
    }

    console.log(this.activeOrder);

  }

  ngOnDestroy() {
    this.modal.unregister('showOrder');
  }
}
