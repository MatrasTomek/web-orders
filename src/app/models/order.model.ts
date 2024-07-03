export interface IClientDetails {
  clientId: string;
}
export interface ICarrierDetails {
  carrierId: string;
}

export interface IOrderDetails {
  loadDate: Date;
  loadPlace: string;
  loadAddress: string;
  unloadDate: Date;
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
  clientDetails: IClientDetails;
  carrierDetails: ICarrierDetails;
  orderDetails: IOrderDetails;
  conditions: IOrderConditions;
}
