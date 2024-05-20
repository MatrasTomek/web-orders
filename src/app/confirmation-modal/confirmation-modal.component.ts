import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalService } from '../services/modal.service';
import ICustomer from '../models/customer.model';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent {
  @Input() confirmationMessage: string = '';
  @Input() confirmationAcceptLabel: string = '';
  @Input() activeCustomer: ICustomer | null = null;
  @Output() confirmationFn = new EventEmitter();

  constructor(public modal: ModalService) {}

  ngOnInit(): void {
    this.modal.register('confirmationModal');
  }

  ngOnDestroy() {
    this.modal.unregister('confirmationModal');
  }

  confirmationFunction() {
    this.confirmationFn.emit(this.activeCustomer);
    this.closeModal('close');
  }

  closeModal($event: any) {
    this.modal.toggleModal('confirmationModal');
  }
}
