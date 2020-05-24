import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snakeToSentenceCase'
})
export class SnakeToSentenceCasePipe implements PipeTransform {
  transform(word: string): unknown {
    return word
      ?.split('_')
      .map(w => w[0] + w.slice(1).toLowerCase())
      .join(' ') ?? '';
  }
}
