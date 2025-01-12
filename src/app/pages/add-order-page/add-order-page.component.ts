import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { IOrder } from 'src/app/models/order.model';
import { ActivatedRoute, Router } from '@angular/router';

import { ModalService } from 'src/app/services/modal.service';
import { OrderService } from 'src/app/services/order.service';
import { OrderNumberGeneratorService } from 'src/app/services/order-number-generator.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAllOrders } from 'src/app/store/selectors/order.selectors';
import { addOrder, editOrder } from 'src/app/store/actions/order.actions';
import ICustomer from 'src/app/models/customer.model';
import { selectAllCustomers } from 'src/app/store/selectors/customer.selectors';
import { loadCustomers } from 'src/app/store/actions/customer.actions';

@Component({
	selector: 'app-add-order-page',
	templateUrl: './add-order-page.component.html',
	styleUrls: ['./add-order-page.component.scss'],
})
export class AddOrderPageComponent implements OnInit {
	items: MenuItem[] = [];
	activeIndex: number = 0;
	orderEditData: any = {};
	customers$: Observable<ICustomer[]> = this.store.select(selectAllCustomers);
	orders$: Observable<IOrder[]> = this.store.select(selectAllOrders);
	selectedCustomer: ICustomer | null = null;
	selectedCarrier: ICustomer | null = null;

	constructor(
		public modal: ModalService,
		private orderItem: OrderService,
		private route: ActivatedRoute,
		private router: Router,
		private orderNumberGen: OrderNumberGeneratorService,
		private store: Store
	) {
		this.route.queryParams.subscribe((params) => {
			this.orderEditData = params;
		});
	}

	//form
	inSubmission: boolean = false;
	showAlert = false;
	alertMsg = 'Proszę czekać, klient jest dodawany.';
	alertColor = 'info';
	confirmationMessage: string = '';
	order: boolean = false;

	//clients
	client: any = null;
	carrier: any = null;
	kindOfCustomer?: 'client' | 'carrier' | null;

	//loads
	loadDate = new FormControl('', [Validators.required]);
	loadHrs = new FormControl('', [Validators.required]);
	loadPlace = new FormControl('', [Validators.required]);
	loadAddress = new FormControl('', [Validators.required]);

	unloadDate = new FormControl('', [Validators.required]);
	unloadHrs = new FormControl('', [Validators.required]);
	unloadPlace = new FormControl('', [Validators.required]);
	unloadAddress = new FormControl('', [Validators.required]);

	driver = new FormControl('');
	truck = new FormControl('');

	goods = new FormControl('');
	dimension = new FormControl('');
	weight = new FormControl('');

	orderForm = new FormGroup({
		loadDate: this.loadDate,
		loadHrs: this.loadHrs,
		loadPlace: this.loadPlace,
		loadAddress: this.loadAddress,
		unloadDate: this.unloadDate,
		unloadHrs: this.unloadHrs,
		unloadPlace: this.unloadPlace,
		unloadAddress: this.unloadAddress,
		driver: this.driver,
		truck: this.truck,
		goods: this.goods,
		dimension: this.dimension,
		weight: this.weight,
	});

	//conditions
	isFixed = new FormControl<boolean>(false);
	fixDetails = new FormControl('');
	isAdr = new FormControl<boolean>(false);
	adrDetails = new FormControl('');
	isFrigo = new FormControl<boolean>(false);
	isFrachtPln = new FormControl<boolean>(false);
	frigoDetails = new FormControl('');
	customerTerm = new FormControl('', [Validators.required]);
	customerFreight = new FormControl('', [Validators.required]);
	carrierTerm = new FormControl('', [Validators.required]);
	carrierFreight = new FormControl('', [Validators.required]);
	description = new FormControl('');

	conditionForm = new FormGroup({
		isFixed: this.isFixed,
		fixDetails: this.fixDetails,
		isAdr: this.isAdr,
		adrDetails: this.adrDetails,
		isFrigo: this.isFrigo,
		isFrachtPln: this.isFrachtPln,
		frigoDetails: this.frigoDetails,
		customerTerm: this.customerTerm,
		customerFreight: this.customerFreight,
		carrierTerm: this.carrierTerm,
		carrierFreight: this.carrierFreight,
		description: this.description,
	});

	onActiveIndexChange($event: number) {
		this.activeIndex = $event;
	}

	ngOnInit() {
		this.customers$.subscribe((customers) => {
			if (!customers || customers.length === 0) {
				this.store.dispatch(loadCustomers());
			}
		});

		this.loadDate.markAsTouched();
		this.loadDate.markAsDirty();
		this.loadHrs.markAsTouched();
		this.loadHrs.markAsDirty();
		this.loadPlace.markAsTouched();
		this.loadPlace.markAsDirty();
		this.loadAddress.markAsTouched();
		this.loadAddress.markAsDirty();
		this.unloadDate.markAsTouched();
		this.unloadDate.markAsDirty();
		this.unloadHrs.markAsTouched();
		this.unloadHrs.markAsDirty();
		this.unloadPlace.markAsTouched();
		this.unloadPlace.markAsDirty();
		this.unloadAddress.markAsTouched();
		this.unloadAddress.markAsDirty();
		this.customerTerm.markAsTouched();
		this.customerTerm.markAsDirty();
		this.customerFreight.markAsTouched();
		this.customerFreight.markAsDirty();
		this.carrierTerm.markAsTouched();
		this.carrierTerm.markAsDirty();
		this.carrierFreight.markAsTouched();
		this.carrierFreight.markAsDirty();

		this.items = [
			{
				label: 'Klient | Przewoźnik',
				// command: (event: any) => this.messageService.add({severity:'info', summary:'First Step', detail: event.item.label})
			},
			{
				label: 'Dane zlecenia',
				// command: (event: any) => this.messageService.add({severity:'info', summary:'Second Step', detail: event.item.label})
			},
			{
				label: 'Warunki zlecenia',
				// command: (event: any) => this.messageService.add({severity:'info', summary:'Third Step', detail: event.item.label})
			},
		];

		if (Object.keys(this.orderEditData).length !== 0) {
			this.fillFormWithEditData();
		}
	}

	fillFormWithEditData() {
		const clientDetails =
			typeof this.orderEditData.clientDetails === 'string'
				? JSON.parse(this.orderEditData.clientDetails)
				: this.orderEditData.clientDetails;

		const carrierDetails =
			typeof this.orderEditData.carrierDetails === 'string'
				? JSON.parse(this.orderEditData.carrierDetails)
				: this.orderEditData.carrierDetails;

		const orderDetails =
			typeof this.orderEditData.orderDetails === 'string'
				? JSON.parse(this.orderEditData.orderDetails)
				: this.orderEditData.orderDetails;

		const conditions =
			typeof this.orderEditData.conditions === 'string' ? JSON.parse(this.orderEditData.conditions) : this.orderEditData.conditions;

		this.orderForm.patchValue({
			loadDate: orderDetails?.loadDate || '',
			loadHrs: orderDetails?.loadHrs || '',
			loadPlace: orderDetails?.loadPlace || '',
			loadAddress: orderDetails?.loadAddress || '',
			unloadDate: orderDetails?.unloadDate || '',
			unloadHrs: orderDetails?.unloadHrs || '',
			unloadPlace: orderDetails?.unloadPlace || '',
			unloadAddress: orderDetails?.unloadAddress || '',
			driver: orderDetails?.driver || '',
			truck: orderDetails?.truck || '',
			goods: orderDetails?.goods || '',
			dimension: orderDetails?.dimension || '',
			weight: orderDetails?.weight || '',
		});

		this.conditionForm.patchValue({
			isFixed: conditions?.isFixed || false,
			fixDetails: conditions?.fixDetails || '',
			isAdr: conditions?.isAdr || false,
			adrDetails: conditions?.adrDetails || '',
			isFrigo: conditions?.isFrigo || false,
			isFrachtPln: conditions?.isFrachtPln || false,
			frigoDetails: conditions?.frigoDetails || '',
			customerTerm: conditions?.customerTerm || '',
			customerFreight: conditions?.customerFreight || '',
			carrierTerm: conditions?.carrierTerm || '',
			carrierFreight: conditions?.carrierFreight || '',
			description: conditions?.description || '',
		});

		this.selectedCustomer = clientDetails;
		this.selectedCarrier = carrierDetails;
	}

	getCustomer($event: any, kindOfCustomer: 'client' | 'carrier' | null) {
		$event.preventDefault();
		this.kindOfCustomer = kindOfCustomer;
		this.modal.toggleModal('getCustomer');
	}

	addCustomer($event: any, kindOfCustomer: 'client' | 'carrier' | null) {
		$event.preventDefault();
		this.kindOfCustomer = kindOfCustomer;
		this.modal.toggleModal('addCustomer');
	}

	addUpdate($event: any) {
		if (!$event.kindOfCustomer) {
			return;
		}

		if ($event.kindOfCustomer === 'client') {
			this.client = $event.customer;
		} else {
			this.carrier = $event.customer;
		}
	}

	addOrder() {
		this.activeIndex = 2;
		this.order = true;
		this.client = this.selectedCustomer;
		this.carrier = this.selectedCarrier;
	}

	resetForm($event: any, formType: string) {
		switch (formType) {
			case 'customer':
				this.selectedCustomer = null;
				this.selectedCarrier = null;
				break;
			case 'order':
				this.orderForm.reset();
				break;
			case 'conditions':
				this.conditionForm.reset();
				break;
			default:
				console.error('Nieznana wartość');
		}

		// $event.preventDefault();
		// this.confirmationMessage = `Czy chcesz wyczyścić dane ?`;
		// this.modal.toggleModal('confirmationModal');
	}

	plLocale: any = {
		firstDayOfWeek: 1,
		dayNames: ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'],
		dayNamesShort: ['ndz', 'pon', 'wt', 'śr', 'czw', 'pt', 'sob'],
		dayNamesMin: ['N', 'P', 'W', 'Ś', 'C', 'P', 'S'],
		monthNames: [
			'styczeń',
			'luty',
			'marzec',
			'kwiecień',
			'maj',
			'czerwiec',
			'lipiec',
			'sierpień',
			'wrzesień',
			'październik',
			'listopad',
			'grudzień',
		],
		monthNamesShort: ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'],
		today: 'Dziś',
		clear: 'Wyczyść',
	};

	acceptAllForm() {
		this.showAlert = true;
		this.alertMsg = 'Proszę czekać, zlecenie jest dodawane.';
		this.alertColor = 'info';
		this.inSubmission = true;

		let ordersLength: number = 0;

		this.orders$.subscribe((orders) => {
			ordersLength = orders.filter((order) => order?.orderNumber?.endsWith('2025')).length;
		});

		const orderNumber = this.orderNumberGen.numberGenerator(ordersLength + 10, this.orderForm.value.loadDate);

		const orderDetails = this.orderForm.value;

		const loadDateMilliseconds = orderDetails.loadDate ? new Date(orderDetails.loadDate).getTime() : null;
		const unloadDateMilliseconds = orderDetails.unloadDate ? new Date(orderDetails.unloadDate).getTime() : null;

		const completeOrder = {
			...(this.orderEditData?.id ? { id: this.orderEditData.id } : {}),
			orderNumber: this.orderEditData?.orderNumber ? this.orderEditData?.orderNumber : orderNumber,
			clientDetails: this.selectedCustomer,
			carrierDetails: this.selectedCarrier,
			orderDetails: {
				...orderDetails,
				loadDate: loadDateMilliseconds,
				unloadDate: unloadDateMilliseconds,
			},
			conditions: this.conditionForm.value,
		};

		try {
			if (Object.keys(this.orderEditData).length !== 0 && this.orderEditData?.id) {
				this.store.dispatch(editOrder({ orderId: this.orderEditData.id, order: completeOrder as IOrder }));
			} else {
				this.store.dispatch(addOrder({ Order: completeOrder as IOrder }));
			}
		} catch (e) {
			console.error(e);

			this.alertMsg = 'Cos poszło nie tak, spróbuj jeszcze raz za chwilę.';
			this.alertColor = 'warning';
			this.inSubmission = false;

			setTimeout(() => {
				this.showAlert = false;
			}, 3000);

			return;
		}

		this.alertMsg = Object.keys(this.orderEditData).length !== 0 ? 'Sukces! Zlecenie zmienione.' : 'Sukces! Zlecenie dodane.';
		this.alertColor = 'success';
		this.inSubmission = false;

		this.router.navigate(['/orders']);
		this.client = null;
		this.selectedCustomer = null;
		this.carrier = null;
		this.selectedCarrier = null;

		setTimeout(() => {
			this.showAlert = false;
		}, 2500);
	}
}
