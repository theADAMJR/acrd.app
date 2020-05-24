import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationString'
})
export class DurationStringPipe implements PipeTransform {

  transform(value: number | string) {
    const seconds = Number(value);
    return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
  }
}
