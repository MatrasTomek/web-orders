import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestampToDate'
})
export class TimestampToDatePipe implements PipeTransform {

  transform(value: any): string {
    if (value && value.seconds) {

      const date = new Date(value.seconds * 1000);
      return date.toLocaleString();
    }
    return value;
  }

}
