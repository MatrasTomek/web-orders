import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class OrderNumberGeneratorService {
	constructor() {}

	numberGenerator(itemNumber: number, date: any) {
		const month = date.getMonth();
		const year = date.getFullYear();

		return `${itemNumber}/${this.getMonthName(month)}/${year}`;
	}

	getMonthName(month: number) {
		const months = ['STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE', 'LIP', 'SIE', 'WRZ', 'PAZ', 'LIS', 'GRU'];
		return months[month];
	}
}
