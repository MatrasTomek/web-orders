import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { IOrder } from '../models/order.model';



@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  // generatePDF(order: IOrder) {


  //   const {orderNumber, carrierDetails, clientDetails, conditions, orderDetails } = order
  //   console.log(order);

  //   const doc = new jsPDF();

  //   doc.setFont('Roboto', 'normal');

  //   function drawRoundedRect(doc: jsPDF, x: number, y: number, width: number, height: number, radius: number) {
  //     doc.setDrawColor(0, 0, 0); // Kolor obramowania (czarny)
  //     doc.setLineWidth(0.5); // Grubość obramowania
  //     doc.roundedRect(x, y, width, height, radius, radius);
  //   }

  //   // Szerokość tabeli
  //     const tableWidth = 100; // Dostosuj szerokość tabeli w mm
  //     const margin = 10; // Margines między tabelami

  //   // Pozycje x dla tabel
  //     const x1 = 10; // Pozycja x pierwszej tabeli
  //     const x2 = x1 + tableWidth + margin; // Pozycja x drugiej tabeli

  //   // Tytuł dokumentu
  //   doc.text(`Zlecenie spedycyjne nr: ${orderNumber}`, 10, 10);

  //   // // Pierwsza tabela
  //   // const table1 = dataSet1.map(item => [item.item, item.quantity, item.price]);
  //   // doc.autoTable({
  //   //   head: [['Produkt', 'Ilość', 'Cena']],
  //   //   body: table1,
  //   //   startY: 20
  //   // });
  //   autoTable(doc, {
  //     startY: 20,
  //     margin: { left: x1 },
  //     head: [['Zleceniodawca']],
  //     body: [['Wiesław Dulowski Przedsiębiorstwo Handlowe "Omega"'], ['Bolesława Prusa 22, 58-310 Szczawno-Zdrój'], ['PL8861111165']],
  //     theme: 'plain',
  //     styles: {
  //       cellPadding: 1, // Odstęp wewnętrzny komórek
  //       fontSize: 10,
  //       textColor: [0, 0, 0], // Kolor tekstu
  //       fillColor: [255, 255, 255], // Kolor tła komórek (biały, aby nie było kolorowania)
  //       // lineWidth: 0.2 // Grubość linii obramowania
  //     },
  //     headStyles: {
  //       fillColor: [255, 255, 255], // Kolor tła nagłówka (biały)
  //       textColor: [0, 0, 0] // Kolor tekstu nagłówka
  //     },

  //   });

  //   autoTable(doc, {
  //     startY: 50,
  //     margin: { left: x1 },
  //     head: [['Zleceniobiorca']],
  //     body: [[carrierDetails.name], [carrierDetails.adress], [carrierDetails.vat]],
  //     theme: 'plain',
  //     styles: {
  //       cellPadding: 1, // Odstęp wewnętrzny komórek
  //       fontSize: 10,
  //       textColor: [0, 0, 0], // Kolor tekstu
  //       fillColor: [255, 255, 255], // Kolor tła komórek (biały, aby nie było kolorowania)
  //       // lineWidth: 0.2 // Grubość linii obramowania
  //     },
  //     headStyles: {
  //       fillColor: [255, 255, 255], // Kolor tła nagłówka (biały)
  //       textColor: [0, 0, 0] // Kolor tekstu nagłówka
  //     },

  //   });


  //   // // Druga tabela
  //   // const table2 = dataSet2.map(item => [item.item, item.duration, item.cost]);
  //   // // doc.autoTable({
  //   // //   head: [['Usługa', 'Czas trwania', 'Koszt']],
  //   // //   body: table2,
  //   // //   startY: doc.lastAutoTable.finalY + 10 // dodajemy odstęp między tabelami
  //   // // });
  //   // autoTable(doc, {
  //   //   head: [['Usługa', 'Czas trwania', 'Koszt']],
  //   //   body: table2,
  //   //   startY: 40 // dodajemy odstęp między tabelami
  //   // });

  //   // // Zapis dokumentu PDF
  //   doc.save(`zlecenie_${orderNumber}_.pdf`);
  // }

  generatePDF(order: IOrder) {
    const {orderNumber, carrierDetails, clientDetails, conditions, orderDetails } = order
    const doc = new jsPDF();
    const htmlContent  = document.getElementById('htmlData');

    if (htmlContent ) {
      doc.html(htmlContent, {
        callback: function (doc) {

          doc.save(`zlecenie_${orderNumber}_.pdf`);
        },

        x: 10,
        y: 10
      });
    }
  }
}


//https://stackblitz.com/edit/jspdf-angular-example?file=src%2Fapp%2Fapp.component.html
