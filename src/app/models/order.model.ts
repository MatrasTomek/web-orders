export interface IClientDetails {
  adress: string;
  email?: string;
  name: string;
  phone?: string;
  vat: string;

}
export interface ICarrierDetails {
  adress: string
  email?: string
  name: string
  phone?: string
  vat: string

}

export interface IOrderDetails {
  loadDate: string;
  loadPlace: string;
  loadAddress: string;
  unloadDate: string;
  unloadPlace: string;
  unloadAddress: string;
  driver?: string;
  truck?: string;
  goods?: string;
  dimension?: string;
  weight?: string;
}

export interface IOrderConditions {
  fix?: string;
  adr?: string;
  frigo?: string;
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
