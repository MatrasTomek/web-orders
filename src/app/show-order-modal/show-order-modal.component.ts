import { Component, Input } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { IOrder } from '../models/order.model';
import jsPDF from 'jspdf';

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

  generatePDF(orderNumber: any) {
    // const {orderNumber, carrierDetails, clientDetails, conditions, orderDetails } = order
    const doc = new jsPDF('p', 'mm', 'a4');
    const htmlContent  = document.getElementById('htmlData');

    console.log(orderNumber, htmlContent);


    if (htmlContent ) {

      const htmlWidth = htmlContent.offsetWidth;
      const htmlHeight = htmlContent.offsetHeight;


      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();


      const scale = Math.min(pageWidth / htmlWidth, pageHeight / htmlHeight) * 0.9;

      setTimeout(()=>{

        doc.html(htmlContent, {
          callback: function (doc) {

            doc.save(`zlecenie_${orderNumber}_.pdf`);
          },

          x: 10,
          y: 10,
          width: 170,
          html2canvas: {scale: scale},
        });
      }, 500)
    }
  }
}
