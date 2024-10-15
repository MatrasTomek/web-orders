export interface IClientDetails {
	adress: string;
	email?: string;
	name: string;
	phone?: string;
	vat: string;
}
export interface ICarrierDetails {
	adress: string;
	email?: string;
	name: string;
	phone?: string;
	vat: string;
}

export interface IOrderDetails {
	loadDate: any;
	loadPlace: string;
	loadAddress: string;
	unloadDate: any;
	unloadPlace: string;
	unloadAddress: string;
	driver?: string;
	truck?: string;
	goods?: string;
	dimension?: string;
	weight?: string;
}

export interface IOrderConditions {
	isFixed?: boolean;
	fixDetails?: string;
	isAdr?: boolean;
	adrDetails?: string;
	isFrigo?: boolean;
	isFrachtPln?: boolean;
	frigoDetails?: string;
	customerTerm: string;
	customerFreight: string;
	carrierTerm: string;
	carrierFreight: string;
	description?: string;
}

export interface IOrder {
	id?: string;
	orderNumber?: string;
	clientDetails: IClientDetails;
	carrierDetails: ICarrierDetails;
	orderDetails: IOrderDetails;
	conditions: IOrderConditions;
}
