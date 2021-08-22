import { Document } from 'mongoose';

export default abstract class DBWrapper<K, T extends Document> {
  public abstract get(identifier: K | undefined): Promise<T | null | undefined>;

  save(savedType: T) {
    return savedType?.save();
  }
}