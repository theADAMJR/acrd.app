import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'miniDate'
})
export class MiniDatePipe implements PipeTransform {
  transform(dateString: string, ...args: unknown[]): unknown {
    const date = new Date(dateString);
    return `${date.getDate()}/${(date.getMonth() + 1)}`;    
  }
}
