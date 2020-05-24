import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncated'
})
export class TruncatedPipe implements PipeTransform {

  transform(words: string, max: number) {
    return words.substring(0, max) + '...';
  }
}
