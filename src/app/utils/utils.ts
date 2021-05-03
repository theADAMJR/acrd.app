import { hacker } from 'faker';

export function toIterable(length: number) {
  const array = [];
  for (let i = 0; i < length; i++)
    array.push(i);
  return array;
}

export function camelToSentenceCase(words: string) {
  const regex = /([A-Z])(?=[a-z][A-Z])|([a-z])(?=[A-Z])/g;
  return words
      .replace(regex, '$& ')[0]
      .toUpperCase() +
    words
      .replace(regex, '$& ')
      .slice(1);
}

export function sentenceToCamelCase(words: string) {
  const capitalized = words
    .replace(/\s+(.)/g, (match, group) => group.toUpperCase());
  return capitalized[0].toLowerCase() + capitalized.slice(1);
}

export function kebabToCamelCase(words: string) {
  const arr = words.split('-');
  const capital = arr.map((item, index) =>
    index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item);

  const capitalized = capital.join('');
  return capitalized[0].toLowerCase() + capitalized.slice(1);
}

export function generateUsername() {
  return `${hacker
    .adjective()
    .replace(/ /, '')}-${hacker
    .noun()
    .replace(/ /, '')}`
}

export function uuid() {
  const s4 = () => Math
    .floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);  
  return 'u' + new Array(8)
    .fill('')
    .map(s4)
    .join('');  
}

export function timestamp(date: Date) { 
  date = new Date(date);
  const timestamp = date.toTimeString().slice(0, 5);
  
  if (getDaysAgo(date))
    return `Today at ${timestamp}`;
  else if (getDaysAgo(date, -1))
    return `Yesterday at ${timestamp}`;
  else if (getDaysAgo(date, 1))
    return `Tomorrow at ${timestamp}`;

  return date
    .toJSON()
    .slice(0,10)
    .split('-')
    .reverse()
    .join('/');
}
function getDaysAgo(date: Date, days = 0) {
  return date.getDate() === new Date().getDate() + days
    && date.getMonth() === new Date().getMonth()
    && date.getFullYear() === new Date().getFullYear()
}