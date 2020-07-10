import { Pipe, PipeTransform } from '@angular/core';
import { camelToSentenceCase } from '../utils';

@Pipe({ name: 'camelToSentenceCase' })
export class CamelToSentenceCasePipe implements PipeTransform {
  transform(words: string) {
    return camelToSentenceCase(words);
  }
}
