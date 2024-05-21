export default interface IOrder {
  id?: string;
  clientDetails: {
    clientName: string;
    clientAddress: string;
    clientVat: string;
  };
  customerDetails: {
    customerName: string;
    customerAddress: string;
    customerVat: string;
  };
  orderDetails: {
    loadDetails: {
      loadAddress: string;
      loadCity: string;
      loadZip: string;
      loadHrs: string;
    };
    unloadDetails: {
      unloadAddress: string;
      unloadCity: string;
      unloadZip: string;
      unloadHrs: string;
    };
    shipmentDetails: {
      size: string;
      weight: number;
    };
    driverDetails: {
      driverName?: string;
      truckPlate?: number;
    };
    requirementDetails: {
      requirements?: string;
      adr?: boolean;
      adrCode?: string;
      frigo?: boolean;
      frigoTemp?: number;
      insuranceValue?: string;
      onTimeDelivery?: boolean;
      onTimeHrs?: number;
      penalties?: boolean;
    };
  };
}
