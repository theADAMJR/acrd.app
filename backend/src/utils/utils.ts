import { hacker } from 'faker';
import { Document } from 'mongoose';
import { snowflakeToDate } from '../data/snowflake-entity';

export function getNameAcronym(name: string) {  
  return name
    .split(' ')
    .slice(0, 3)
    .map(str => str[0])
    .join('');
}

export function createdAtToDate(this: Document) {  
  return snowflakeToDate(this.id);
}

export function generateUsername() {
  return `${hacker
    .adjective()
    .replace(/ /, '')}-${hacker
    .noun()
    .replace(/ /, '')}`
}

export function useId(this: Document) {
  const obj = this.toObject();
  
  this.id = this._id;
  delete this._id;

  return obj;
}

export function checkForDuplicates(array: any[]) {
  return new Set(array).size !== array.length
}

export const array = {
  ascending: (a, b) => (a > b) ? 1 : -1,
};

export function randomFrom(...arr: any[]) {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}
