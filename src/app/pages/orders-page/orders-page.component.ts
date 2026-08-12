import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { IOrder, isStandaloneDocumentOrder } from 'src/app/models/order.model';
import { ModalService } from 'src/app/services/modal.service';
import { OrderService } from 'src/app/services/order.service';
import { deleteOrder, loadOrders } from 'src/app/store/actions/order.actions';
import { selectAllOrders } from 'src/app/store/selectors/order.selectors';

@Component({
	selector: 'app-orders-page',
	templateUrl: './orders-page.component.html',
	styleUrls: ['./orders-page.component.scss'],
})
export class OrdersPageComponent implements OnInit {
	@ViewChild('ordersTb') ordersTable!: Table;

	constructor(
		public modal: ModalService,
		private router: Router,
		private store: Store,
	) {}

	orders$: Observable<IOrder[]> = this.store.select(selectAllOrders);
	cols: any[] = [];
	ordersList: IOrder[] = [];
	selectedColumns: any[] = [];
	activeOrder: IOrder | null = null;
	activeOrderId: string | undefined = undefined;
	confirmationMessage: string = '';
	fieldsArray: string[] = [];
	cardSearchTerm: string = '';

	ngOnInit() {
		this.orders$.subscribe((orders) => {
			if (!orders || orders.length === 0) {
				this.store.dispatch(loadOrders());
			} else {
				this.ordersList = orders.filter((order) => !isStandaloneDocumentOrder(order));
			}
		});

		this.cols = [
			{ field: 'orderNumber', header: 'Numer', selected: true, width: '10rem' },
			{ field: 'carrierDetails.name', header: 'Przewoźnik', selected: true },
			{ field: 'carrierDetails.adress', header: 'Adres przewoźnika' },
			{ field: 'carrierDetails.phone', header: 'Telefon przewoźnika' },
			{ field: 'carrierDetails.vat', header: 'VAT przewoźnika' },
			{ field: 'carrierDetails.email', header: 'eMail przewoźnika' },
			{ field: 'clientDetails.name', header: 'Klient' },
			{ field: 'clientDetails.adress', header: 'Adres klienta' },
			{ field: 'clientDetails.phone', header: 'Telefon klienta' },
			{ field: 'clientDetails.vat', header: 'VAT klienta' },
			{ field: 'clientDetails.email', header: 'eMail klienta' },
			{ field: 'orderDetails.loadDate', header: 'Data załadunku' },
			{ field: 'orderDetails.loadHrs', header: 'Godzina załadunku' },
			{ field: 'orderDetails.loadPlace', header: 'Miejsce załadunku' },
			{ field: 'orderDetails.loadAddress', header: 'Adres załadunku' },
			{ field: 'orderDetails.unloadDate', header: 'Data rozładunku' },
			{ field: 'orderDetails.unloadHrs', header: 'Godzina rozładunku' },
			{ field: 'orderDetails.unloadPlace', header: 'Miejsce rozładunku' },
			{ field: 'orderDetails.unloadAddress', header: 'Adres rozładunku' },
			{ field: 'orderDetails.dimension', header: 'Ilość', selected: true },
			{ field: 'orderDetails.weight', header: 'Waga', selected: true, width: '10rem' },
			{ field: 'orderDetails.goods', header: 'Towar' },
			{ field: 'orderDetails.driver', header: 'Kierowca' },
			{ field: 'orderDetails.truck', header: 'Samochód' },
			{ field: 'conditions.adrDetails', header: 'Adr wymagania' },
			{ field: 'conditions.frigoDetails', header: 'Chłodnia wymagania' },
			{ field: 'conditions.fixDetails', header: 'Czas tranzytu' },
			{ field: 'conditions.isFrachtPln', header: 'Waluta', hidden: true },
			{ field: 'conditions.customerFreight', header: 'Fracht klienta', selected: true },
			{ field: 'conditions.customerTerm', header: 'Termin klienta' },
			{ field: 'conditions.carrierFreight', header: 'Fracht przewoźnika', selected: true },
			{ field: 'conditions.carrierTerm', header: 'Termin przewoźnika' },
			{ field: 'conditions.description', header: 'Dodatkowy opis' },
		];

		this.selectedColumns = this.cols.filter((col) => col.selected);
		this.fieldsArray = this.cols.filter((col) => !col.hidden).map((col) => col.field);
	}

	openAddModal($event: Event) {
		$event.preventDefault();
		this.modal.toggleModal('addCustomer');
	}

	handleInput(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		if (inputElement && inputElement.value != null) {
			this.ordersTable.filterGlobal(inputElement.value, 'contains');
		}
	}

	clear(table: Table) {
		table.clear();
		this.ordersList = [...this.ordersList];
	}

	goToEditOrCopyOrder(order: IOrder, action: string) {
		const orderParse = {
			clientDetails: JSON.stringify(order.clientDetails),
			carrierDetails: JSON.stringify(order.carrierDetails),
			orderDetails: JSON.stringify(order.orderDetails),
			conditions: JSON.stringify(order.conditions),
			...(action === 'edit' && { id: order.id }),
			...(action === 'edit' && { orderNumber: order.orderNumber }),
		};

		this.router.navigate(['/add-order'], { queryParams: orderParse });
	}

	openConfirmationModal($event: Event, order: IOrder) {
		$event.preventDefault();

		this.confirmationMessage = `Czy chesz usunąć zlecenie: ${order.orderNumber} ?`;
		this.activeOrderId = order.id;
		this.modal.toggleModal('confirmationModal');
	}

	deleteConfirmed($event: any) {
		this.store.dispatch(deleteOrder({ orderId: $event }));
	}

	// Wyszukiwarka dla widoku kart (układ 1) — filtr po stronie klienta.
	// Tabela (układ 2) nadal używa globalFilter PrimeNG bez zmian.
	get filteredOrders(): IOrder[] {
		const term = this.cardSearchTerm.trim().toLowerCase();
		if (!term) {
			return this.ordersList;
		}
		return this.ordersList.filter((order) =>
			this.fieldsArray.some((field) => {
				const value = this.resolveField(order, field);
				return value != null && value.toString().toLowerCase().includes(term);
			}),
		);
	}

	resolveField(obj: any, path: string) {
		return path.split('.').reduce((o, i) => (o ? o[i] : null), obj);
	}

	combineFields(order: any, field: string, curr: any): string {
		const value = this.resolveField(order, field);
		const currency = this.resolveField(order, curr);
		return `${value} ${currency ? 'PLN' : 'EUR'}`;
	}

	showOrder($event: Event, order: IOrder) {
		$event.preventDefault();
		this.activeOrder = order;

		const existingPrintWindow = (window as any).__orderPrintWindow as Window | null;
		if (existingPrintWindow) {
			existingPrintWindow.close();
		}

		const printWindow = window.open('', '_blank', 'width=1200,height=900');
		if (!printWindow) {
			return;
		}
		(window as any).__orderPrintWindow = printWindow;

		const companyName = 'Wiesław Dulowski Przedsiębiorstwo Handlowe "Omega"';
		const companyAddress = 'Bolesława Prusa 22, 58-310 Szczawno-Zdrój';
		const companyNip = 'PL8861111165';
		const orderNumber = order.orderNumber ?? 'zlecenie';
		const loadDate = order.orderDetails?.loadDate ? new Date(order.orderDetails.loadDate).toLocaleDateString('pl-PL') : '-';
		const unloadDate = order.orderDetails?.unloadDate ? new Date(order.orderDetails.unloadDate).toLocaleDateString('pl-PL') : '-';
		const escapeHtml = (value: string | undefined | null) =>
			String(value ?? '-')
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#039;');

		printWindow.document.write(`
			<!doctype html>
			<html lang="pl">
			<head>
				<meta charset="UTF-8" />
				<title>Zlecenie ${escapeHtml(orderNumber)}</title>
				<style>
					* { box-sizing: border-box; }
					body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: #f3f4f6; color: #111827; }
					.page { width: 210mm; min-height: 297mm; margin: 0 auto; background: white; padding: 10mm 12mm; }
					.header { margin-bottom: 12px; }
					.title { text-align: center; font-size: 24px; font-weight: 700; margin: 0 0 4px; }
					.order-number { text-align: center; font-size: 13px; font-weight: 700; letter-spacing: 0.04em; margin-bottom: 16px; }
					.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
					.box { border: 1px solid #d1d5db; border-radius: 8px; padding: 10px 12px; }
					.box h3 { margin: 0 0 8px; font-size: 13px; text-transform: uppercase; }
					.box p { margin: 4px 0; font-size: 12px; line-height: 1.4; }
					.row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
					.meta { font-size: 12px; line-height: 1.7; }
					.meta strong { display: inline-block; min-width: 110px; }
					.table { width: 100%; border-collapse: collapse; margin-top: 8px; }
					.table th, .table td { border: 1px solid #d1d5db; padding: 7px 8px; text-align: left; font-size: 12px; }
					.table th { background: #f9fafb; }
					.conditions { margin-top: 14px; padding-top: 14px; border-top: 2px solid #111827; }
					.conditions h3 { margin: 8px 0 6px; font-size: 15px; }
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
						<div class="order-number">Nr zlecenia: ${escapeHtml(orderNumber)}</div>
					</header>
					<div class="grid">
						<div class="box">
							<h3>Zleceniodawca</h3>
							<p>${escapeHtml(companyName)}</p>
							<p>${escapeHtml(companyAddress)}</p>
							<p>NIP: ${escapeHtml(companyNip)}</p>
						</div>
						<div class="box">
							<h3>Zleceniobiorca</h3>
							<p>${escapeHtml(order.carrierDetails?.name ?? '-')}</p>
							<p>${escapeHtml(order.carrierDetails?.adress ?? '-')}</p>
							<p>NIP: ${escapeHtml(order.carrierDetails?.vat ?? '-')}</p>
						</div>
					</div>
					<div class="row">
						<div class="box meta">
							<div><strong>Załadunek:</strong> ${escapeHtml(loadDate)} ${escapeHtml(order.orderDetails?.loadHrs ?? '')}</div>
							<div><strong>Miejsce:</strong> ${escapeHtml(order.orderDetails?.loadPlace ?? '-')}</div>
							<div><strong>Adres:</strong> ${escapeHtml(order.orderDetails?.loadAddress ?? '-')}</div>
						</div>
						<div class="box meta">
							<div><strong>Rozładunek:</strong> ${escapeHtml(unloadDate)} ${escapeHtml(order.orderDetails?.unloadHrs ?? '')}</div>
							<div><strong>Miejsce:</strong> ${escapeHtml(order.orderDetails?.unloadPlace ?? '-')}</div>
							<div><strong>Adres:</strong> ${escapeHtml(order.orderDetails?.unloadAddress ?? '-')}</div>
						</div>
					</div>
					<div class="conditions">
						<table class="table">
							<tbody>
								<tr>
									<th>Towar</th>
									<th>Wymiary / ilość</th>
									<th>Waga</th>
								</tr>
								<tr>
									<td>${escapeHtml(order.orderDetails?.goods ?? '-')}</td>
									<td>${escapeHtml(order.orderDetails?.dimension ?? '-')}</td>
									<td>${escapeHtml(order.orderDetails?.weight ?? '-')}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="conditions">
						<table class="table">
							<tbody>
								<tr>
									<th>ADR</th>
									<th>Chłodnia</th>
									<th>Fix</th>
								</tr>
								<tr>
									<td>${escapeHtml(order.conditions?.isAdr ? order.conditions.adrDetails : 'Nie')}</td>
									<td>${escapeHtml(order.conditions?.isFrigo ? order.conditions.frigoDetails : 'Nie')}</td>
									<td>${escapeHtml(order.conditions?.isFixed ? order.conditions.fixDetails : 'Nie')}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="conditions row">
						<div class="box meta">
							<div><strong>Kierowca:</strong> ${escapeHtml(order.orderDetails?.driver ?? '-')}</div>
							<div><strong>Pojazd:</strong> ${escapeHtml(order.orderDetails?.truck ?? '-')}</div>
						</div>
						<div class="box meta">
							<div><strong>Fracht:</strong> ${escapeHtml(order.conditions?.carrierFreight ?? '-')} ${order.conditions?.isFrachtPln ? 'PLN' : 'EUR'}</div>
							<div><strong>Termin płatności:</strong> ${escapeHtml(order.conditions?.carrierTerm ?? '-')} dni</div>
						</div>
					</div>
					<div class="conditions">
						<h3>Dodatkowe informacje</h3>
						<p>${escapeHtml(order.conditions?.description ?? '-')}</p>
						<h3>Warunki realizacji i płatności</h3>
						<ul>
							<li class="red">Dokumenty transportowe TYLKO w formacie PDF proszę przesłać wyłącznie na maila: biuro@omega-dulowski.pl. PROSIMY NIE WYSYŁAĆ DOKUMENTÓW POCZTĄ TRADYCYJNĄ.</li>
									<li class="red">FV po za KSEF należy przesyłać wyłącznie w formacie PDF na maila: biuro@omega-dulowski.pl. PROSIMY NIE WYSYŁAĆ FV POCZTĄ TRADYCYJNĄ.</li>
							<li>Termin płatności wynosi ${escapeHtml(order.conditions?.carrierTerm ?? '-')} dni, liczony od daty wpływu FV zleceniobiorcy wraz z dokumentami dotyczącymi tras zawartych w FV.</li>
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
		`);
		printWindow.document.close();
		printWindow.focus();
		setTimeout(() => printWindow.print(), 300);
	}

	// Akcje wyzwalane z modala szczegółów (układ 1 — mobile/tablet).
	// Najpierw zamykamy modal szczegółów, potem wykonujemy właściwą akcję.
	editFromDetails(order: IOrder) {
		this.modal.toggleModal('showOrder');
		this.goToEditOrCopyOrder(order, 'edit');
	}

	copyFromDetails(order: IOrder) {
		this.modal.toggleModal('showOrder');
		this.goToEditOrCopyOrder(order, 'copy');
	}

	deleteFromDetails(order: IOrder) {
		this.modal.toggleModal('showOrder');
		this.confirmationMessage = `Czy chesz usunąć zlecenie: ${order.orderNumber} ?`;
		this.activeOrderId = order.id;
		this.modal.toggleModal('confirmationModal');
	}

	docsFromDetails(order: IOrder) {
		this.modal.toggleModal('showOrder');
		this.activeOrder = order;
		this.modal.toggleModal('docsModal');
	}

	openDocsModal($event: Event, order: IOrder) {
		$event.preventDefault();
		this.activeOrder = order;
		this.modal.toggleModal('docsModal');
	}

	sortNestedField(event: any) {
		const { data, field, order } = event;

		if (field === 'orderNumber') {
			return data.sort((a: any, b: any) => {
				const aValue: string = a[field] ?? '';
				const bValue: string = b[field] ?? '';

				// Format: {number}/{month}/{year}, e.g. "10/STY/2026"
				const aParts = aValue.split('/');
				const bParts = bValue.split('/');

				const aYear = aParts[aParts.length - 1];
				const bYear = bParts[bParts.length - 1];

				const aNum = parseInt(aParts[0], 10);
				const bNum = parseInt(bParts[0], 10);

				const yearComparison = order * aYear.localeCompare(bYear, 'pl', { numeric: true });
				if (yearComparison !== 0) {
					return yearComparison;
				}

				return order * (aNum - bNum);
			});
		} else {
			return data.sort((a: any, b: any) => {
				const aValue = this.getNestedValue(a, field);
				const bValue = this.getNestedValue(b, field);

				if (typeof aValue === 'string' && typeof bValue === 'string') {
					return order * aValue.localeCompare(bValue, 'pl');
				} else if (typeof aValue === 'number' && typeof bValue === 'number') {
					return order * (aValue - bValue);
				} else {
					return 0;
				}
			});
		}
	}

	getNestedValue(obj: any, path: string): any {
		return path.split('.').reduce((acc, key) => acc && acc[key], obj);
	}
}
