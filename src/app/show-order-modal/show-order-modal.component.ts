import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalService } from '../services/modal.service';
import { IOrder } from '../models/order.model';

@Component({
	selector: 'app-show-order-modal',
	templateUrl: 'show-order-modal.component.html',
	styleUrls: ['show-order-modal.component.scss'],
})
export class ShowOrderModalComponent {
	@Input() activeOrder: IOrder | null = null;

	// Akcje dostępne w modalu szczegółów (widoczne w układzie 1 — mobile/tablet).
	@Output() editOrder = new EventEmitter<IOrder>();
	@Output() copyOrder = new EventEmitter<IOrder>();
	@Output() deleteOrder = new EventEmitter<IOrder>();
	@Output() docsOrder = new EventEmitter<IOrder>();

	loadAdress: string = '';
	unloadAdress: string = '';
	customerName: string = '';

	constructor(
		public modal: ModalService,
		private store: Store,
	) {}

	ngOnInit(): void {
		this.modal.register('showOrder');
	}

	ngOnDestroy() {
		this.modal.unregister('showOrder');
	}

	private escapeHtml(value: string | undefined | null): string {
		return String(value ?? '-')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	private getPrintableOrderMarkup(order: IOrder): string {
		const companyName = 'Wiesław Dulowski Przedsiębiorstwo Handlowe "Omega"';
		const companyAddress = 'Bolesława Prusa 22, 58-310 Szczawno-Zdrój';
		const companyNip = 'PL8861111165';
		const orderNumber = this.escapeHtml(order.orderNumber ?? 'zlecenie');
		const carrierName = this.escapeHtml(order.carrierDetails?.name ?? '-');
		const carrierAddress = this.escapeHtml(order.carrierDetails?.adress ?? '-');
		const carrierVat = this.escapeHtml(order.carrierDetails?.vat ?? '-');
		const loadDate = order.orderDetails?.loadDate ? new Date(order.orderDetails.loadDate).toLocaleDateString('pl-PL') : '-';
		const unloadDate = order.orderDetails?.unloadDate ? new Date(order.orderDetails.unloadDate).toLocaleDateString('pl-PL') : '-';
		const loadAddress = this.escapeHtml(order.orderDetails?.loadAddress ?? '-');
		const unloadAddress = this.escapeHtml(order.orderDetails?.unloadAddress ?? '-');
		const loadPlace = this.escapeHtml(order.orderDetails?.loadPlace ?? '-');
		const unloadPlace = this.escapeHtml(order.orderDetails?.unloadPlace ?? '-');
		const goods = this.escapeHtml(order.orderDetails?.goods ?? '-');
		const dimension = this.escapeHtml(order.orderDetails?.dimension ?? '-');
		const weight = this.escapeHtml(order.orderDetails?.weight ?? '-');
		const driver = this.escapeHtml(order.orderDetails?.driver ?? '-');
		const truck = this.escapeHtml(order.orderDetails?.truck ?? '-');
		const freight = `${this.escapeHtml(order.conditions?.carrierFreight ?? '-')} ${order.conditions?.isFrachtPln ? 'PLN' : 'EUR'}`;
		const paymentTerm = this.escapeHtml(order.conditions?.carrierTerm ?? '-');
		const description = this.escapeHtml(order.conditions?.description ?? '-');
		const adr = this.escapeHtml(order.conditions?.isAdr ? order.conditions.adrDetails : 'Nie');
		const frigo = this.escapeHtml(order.conditions?.isFrigo ? order.conditions.frigoDetails : 'Nie');
		const fix = this.escapeHtml(order.conditions?.isFixed ? order.conditions.fixDetails : 'Nie');

		return `
			<!doctype html>
			<html lang="pl">
			<head>
				<meta charset="UTF-8" />
				<title>Zlecenie ${orderNumber}</title>
				<style>
					:root { --ink: #111827; --muted: #374151; --line: #d1d5db; --paper: #ffffff; --accent: #111827; }
					* { box-sizing: border-box; }
					body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: #f3f4f6; color: var(--ink); }
					.page { width: 210mm; min-height: 297mm; margin: 0 auto; background: var(--paper); padding: 10mm 12mm; }
					.header { margin-bottom: 12px; }
					.title { text-align: center; font-size: 24px; font-weight: 700; margin: 0 0 4px; }
					.order-number { text-align: center; font-size: 13px; font-weight: 700; letter-spacing: 0.04em; margin-bottom: 16px; }
					.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
					.box { border: 1px solid var(--line); border-radius: 8px; padding: 10px 12px; }
					.box h3 { margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; }
					.box p { margin: 4px 0; font-size: 12px; line-height: 1.5; }
					.section { margin-top: 14px; }
					.row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
					.meta { font-size: 12px; line-height: 1.7; }
					.meta strong { display: inline-block; min-width: 110px; }
					.table { width: 100%; border-collapse: collapse; margin-top: 8px; }
					.table th, .table td { border: 1px solid var(--line); padding: 7px 8px; text-align: left; font-size: 12px; vertical-align: top; }
					.table th { background: #f9fafb; }
					.conditions { margin-top: 14px; padding-top: 14px; border-top: 2px solid var(--accent); }
					.conditions h3 { margin: 0 0 8px; font-size: 15px; }
					.conditions p, .conditions li { font-size: 11.5px; line-height: 1.6; }
					.conditions ul { margin: 0; padding-left: 18px; }
					.red, .red * { color: #b91c1c !important; font-weight: 700 !important; }
					@page { size: A4 portrait; margin: 10mm; }
					@media print { body { background: white; } .page { box-shadow: none; margin: 0; width: auto; min-height: auto; } }
				</style>
			</head>
			<body>
				<div class="page">
					<header class="header">
						<div class="title">Zlecenie spedycyjne</div>
						<div class="order-number">Nr zlecenia: ${orderNumber}</div>
					</header>

					<div class="grid">
						<div class="box">
							<h3>Zleceniodawca</h3>
							<p>${companyName}</p>
							<p>${companyAddress}</p>
							<p>NIP: ${companyNip}</p>
						</div>
						<div class="box">
							<h3>Zleceniobiorca</h3>
							<p>${carrierName}</p>
							<p>${carrierAddress}</p>
							<p>NIP: ${carrierVat}</p>
						</div>
					</div>

					<div class="section row">
						<div class="box meta">
							<div><strong>Załadunek:</strong> ${loadDate} ${order.orderDetails?.loadHrs ?? ''}</div>
							<div><strong>Miejsce:</strong> ${loadPlace}</div>
							<div><strong>Adres:</strong> ${loadAddress}</div>
						</div>
						<div class="box meta">
							<div><strong>Rozładunek:</strong> ${unloadDate} ${order.orderDetails?.unloadHrs ?? ''}</div>
							<div><strong>Miejsce:</strong> ${unloadPlace}</div>
							<div><strong>Adres:</strong> ${unloadAddress}</div>
						</div>
					</div>

					<div class="section">
						<table class="table">
							<tbody>
								<tr>
									<th>Towar</th>
									<th>Wymiary / ilość</th>
									<th>Waga</th>
								</tr>
								<tr>
									<td>${goods}</td>
									<td>${dimension}</td>
									<td>${weight}</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div class="section">
						<table class="table">
							<tbody>
								<tr>
									<th>ADR</th>
									<th>Chłodnia</th>
									<th>Fix</th>
								</tr>
								<tr>
									<td>${adr}</td>
									<td>${frigo}</td>
									<td>${fix}</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div class="section row">
						<div class="box meta">
							<div><strong>Kierowca:</strong> ${driver}</div>
							<div><strong>Pojazd:</strong> ${truck}</div>
						</div>
						<div class="box meta">
							<div><strong>Fracht:</strong> ${freight}</div>
							<div><strong>Termin płatności:</strong> ${paymentTerm} dni</div>
						</div>
					</div>

					<div class="conditions">
						<h3>Dodatkowe informacje</h3>
						<p>${description}</p>
						<h3>Warunki realizacji i płatności</h3>
						<ul>
							<li class="red">Dokumenty transportowe TYLKO w formacie PDF proszę przesłać wyłącznie na maila: biuro@omega-dulowski.pl. PROSIMY NIE WYSYŁAĆ DOKUMENTÓW POCZTĄ TRADYCYJNĄ.</li>
							<li class="red">FV po za KSEF należy przesyłać wyłącznie w formacie PDF na maila: biuro@omega-dulowski.pl. PROSIMY NIE WYSYŁAĆ FV POCZTĄ TRADYCYJNĄ.</li>
							<li>Termin płatności wynosi ${paymentTerm} dni, liczony od daty wpływu FV zleceniobiorcy wraz z dokumentami dotyczącymi tras zawartych w FV.</li>
							<li>Skrócony termin płatności: skonto 5%, płatność w 48h po otrzymaniu FV wraz z kompletem dokumentów przewozowych. W przypadku skonta FV powinna zostać pomniejszona o 5%, opis: „FV pomniejszona o 5% ze względu na wcześniejszą płatność”.</li>
							<li class="red">Informujemy, że nie akceptujemy faktur, na których skonto udzielane jest przez zewnętrzne podmioty.</li>
							<li>Frachty naliczone w walucie Euro: płatne w Euro na jedno podane konto walutowe.</li>
							<li>Transport krajowy wykonywany w oparciu o: Ustawa o Prawie Przewozowym i OWS.</li>
							<li>Transport międzynarodowy wykonywany w oparciu o: konwencja CMR.</li>
						</ul>
					</div>
				</div>
			</body>
			</html>
		`;
	}

	openOrderPrintPreview(order: IOrder | null): void {
		if (!order) {
			return;
		}

		const existingPrintWindow = (window as any).__orderPrintWindow as Window | null;
		if (existingPrintWindow) {
			existingPrintWindow.close();
		}

		const printWindow = window.open('', '_blank', 'width=1200,height=900');
		if (!printWindow) {
			return;
		}
		(window as any).__orderPrintWindow = printWindow;

		printWindow.document.write(this.getPrintableOrderMarkup(order));
		printWindow.document.close();
		printWindow.focus();

		setTimeout(() => {
			printWindow.print();
		}, 250);
	}

	printOrder(): void {
		this.openOrderPrintPreview(this.activeOrder);
	}

	generatePDF(orderNumber?: string): void {
		this.printOrder();
	}
}
