import { generateSnowflake } from '../src/data/snowflake-entity';

export function longString(length: number) {  
  return new Array(length).fill('a').join();
}
export function longArray(length: number) {
  return new Array(length).fill(generateSnowflake());
}
export function mongooseError(error: any): string | boolean {
  if (error) {
    const key = Object.keys(error.errors)[0];
    return error?.errors[key].message;
  }
  return true;
}
