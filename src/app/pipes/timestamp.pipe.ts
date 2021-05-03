import { Pipe, PipeTransform } from '@angular/core';
import { timestamp } from '../utils/utils';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {
  transform(value: Date): string {
    return timestamp(value);
  }
}
