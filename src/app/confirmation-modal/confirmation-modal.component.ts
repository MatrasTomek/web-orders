import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalService } from '../services/modal.service';
import ICustomer from '../models/customer.model';
import { IOrder } from '../models/order.model';

@Component({
	selector: 'app-confirmation-modal',
	templateUrl: './confirmation-modal.component.html',
	styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent {
	@Input() confirmationMessage: string = '';
	@Input() confirmationAcceptLabel: string = '';
	@Input() activeItem?: string | undefined = undefined;
	@Output() confirmationFn = new EventEmitter();

	constructor(public modal: ModalService) {}

	ngOnInit(): void {
		this.modal.register('confirmationModal');
	}

	ngOnDestroy() {
		this.modal.unregister('confirmationModal');
	}

	confirmationFunction() {
		this.confirmationFn.emit(this.activeItem);
		this.closeModal('close');
	}

	closeModal($event: any) {
		this.modal.toggleModal('confirmationModal');
	}
}
