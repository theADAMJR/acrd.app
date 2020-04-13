import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cleanDateTime' })
export class CleanDateTimePipe implements PipeTransform {

  transform(dateString: string, ...args: unknown[]) {
    const date = new Date(dateString);
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    
    const month = date.toLocaleString('default', { month: 'long' });
    return `${month} ${day} ${date.getFullYear()}, ${hours}:${minutes}`;
  }
}
