import { Document } from 'mongoose';

export function useId(this: Document) {
  const obj = this.toObject();
  
  this.id = this._id;
  delete this._id;

  return obj;
}