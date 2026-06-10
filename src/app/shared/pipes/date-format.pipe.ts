import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'qqDate' })
export class DateFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    const [year, month, day] = value.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
  }
}
