import { Component, Input } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { IOrder } from '../models/order.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
	selector: 'app-show-order-modal',
	templateUrl: 'show-order-modal.component.html',
	styleUrls: ['show-order-modal.component.scss'],
})
export class ShowOrderModalComponent {
	@Input() activeOrder: IOrder | null = null;

	constructor(public modal: ModalService) {}

	ngOnInit(): void {
		this.modal.register('showOrder');
	}

	ngOnDestroy() {
		this.modal.unregister('showOrder');
	}

	generatePDF(orderNumber: any) {
		const doc = new jsPDF('p', 'mm', 'a4');

		const htmlContent = document.getElementById('htmlData');

		if (htmlContent) {
			setTimeout(() => {
				html2canvas(htmlContent).then((canvas) => {
					const imgData = canvas.toDataURL('image/png');
					const a4Width = 210;
					const a4Height = 297;
					const imgWidth = 190;
					let imgHeight = (canvas.height * imgWidth) / canvas.width;

					const positionX = (a4Width - imgWidth) / 2;
					let positionY = 10;

					while (imgHeight > 0) {
						if (imgHeight > a4Height - positionY) {
							doc.addImage(imgData, 'PNG', positionX, positionY, imgWidth, a4Height - positionY);
							doc.addPage();
							imgHeight -= a4Height - positionY;
							positionY = 0;
						} else {
							doc.addImage(imgData, 'PNG', positionX, positionY, imgWidth, imgHeight);
							imgHeight = 0;
						}
					}

					doc.save(`zlecenie_${orderNumber}_.pdf`);
				});
			}, 500);
		}
	}
}
