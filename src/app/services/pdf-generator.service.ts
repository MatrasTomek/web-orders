import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'



@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  generatePDF() {
    const doc = new jsPDF();

    // Przykładowe dane
    const dataSet1 = [
      { item: 'Product A', quantity: 10, price: 50 },
      { item: 'Product B', quantity: 5, price: 30 }
    ];

    const dataSet2 = [
      { item: 'Service A', duration: '2 hours', cost: 100 },
      { item: 'Service B', duration: '3 hours', cost: 150 }
    ];

    // Tytuł dokumentu
    doc.text('Raport sprzedaży', 10, 10);

    // Pierwsza tabela
    const table1 = dataSet1.map(item => [item.item, item.quantity, item.price]);
    // doc.autoTable({
    //   head: [['Produkt', 'Ilość', 'Cena']],
    //   body: table1,
    //   startY: 20
    // });
    autoTable(doc, {
      head: [['Produkt', 'Ilość', 'Cena']],
      body: table1,
      startY: 20
    });

    // Druga tabela
    const table2 = dataSet2.map(item => [item.item, item.duration, item.cost]);
    // doc.autoTable({
    //   head: [['Usługa', 'Czas trwania', 'Koszt']],
    //   body: table2,
    //   startY: doc.lastAutoTable.finalY + 10 // dodajemy odstęp między tabelami
    // });
    autoTable(doc, {
      head: [['Usługa', 'Czas trwania', 'Koszt']],
      body: table2,
      startY: 40 // dodajemy odstęp między tabelami
    });

    // Zapis dokumentu PDF
    doc.save('raport_sprzedaży.pdf');
  }
}
