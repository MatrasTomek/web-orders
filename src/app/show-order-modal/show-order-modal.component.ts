import { Component, Input } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { IOrder } from '../models/order.model';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-show-order-modal',
  templateUrl: 'show-order-modal.component.html',
  styleUrls: ['show-order-modal.component.scss']
})
export class ShowOrderModalComponent {
@Input() activeOrder: IOrder | null = null

public convertedLoadDate: Date | null = null
public convertedUnloadDate: Date | null = null

  constructor(public modal: ModalService) {


  }

  ngOnInit(): void {
    this.modal.register('showOrder');

  }

  ngOnChanges() {
    if (!this.activeOrder) {
      this.convertedLoadDate = null;
      return;
    }
    const loadDate = this.activeOrder.orderDetails?.loadDate;
    const unloadDate = this.activeOrder.orderDetails?.unloadDate;
    this.convertedLoadDate = new Date(loadDate.seconds * 1000);
    this.convertedUnloadDate = new Date(unloadDate.seconds * 1000);
    console.log(this.activeOrder.conditions);



  }

  ngOnDestroy() {
    this.modal.unregister('showOrder');
  }
}
