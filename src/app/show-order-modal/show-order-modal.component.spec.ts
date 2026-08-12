import { ShowOrderModalComponent } from './show-order-modal.component';
import { ModalService } from '../services/modal.service';
import { Store } from '@ngrx/store';

describe('ShowOrderModalComponent', () => {
	let component: ShowOrderModalComponent;
	let modalService: jasmine.SpyObj<ModalService>;
	let store: jasmine.SpyObj<Store>;

	beforeEach(() => {
		modalService = jasmine.createSpyObj('ModalService', ['register', 'unregister', 'toggleModal']);
		store = jasmine.createSpyObj('Store', ['dispatch']);
		component = new ShowOrderModalComponent(modalService, store);
	});

	it('should open the browser print preview for the order content', () => {
		const printWindow = {
			document: { write: jasmine.createSpy('write'), close: jasmine.createSpy('close') },
			focus: jasmine.createSpy('focus'),
			print: jasmine.createSpy('print'),
		} as any;
		spyOn(window, 'open').and.returnValue(printWindow);
		spyOn(window, 'print');
		component.activeOrder = {
			orderNumber: '12/CZE/2026',
			carrierDetails: { name: 'Carrier', adress: 'Test address', vat: '123' },
			orderDetails: {
				loadDate: '2026-01-02',
				loadHrs: '08:00',
				loadAddress: 'Address A',
				loadPlace: 'Place A',
				unloadDate: '2026-01-03',
				unloadHrs: '10:00',
				unloadAddress: 'Address B',
				unloadPlace: 'Place B',
				goods: 'Goods',
				dimension: '2x2',
				weight: '1200',
				driver: 'Driver',
				truck: 'Truck',
			},
			conditions: {
				carrierFreight: 3000,
				isFrachtPln: true,
				carrierTerm: 14,
				description: 'Desc',
				isAdr: false,
				isFrigo: false,
				isFixed: false,
			},
		} as any;

		component.printOrder();

		expect(window.open).toHaveBeenCalled();
		expect(printWindow.document.write).toHaveBeenCalled();
		expect(printWindow.focus).toHaveBeenCalled();
		expect(modalService.toggleModal).not.toHaveBeenCalled();
	});
});
