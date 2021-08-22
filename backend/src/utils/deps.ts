export default class Deps {  
  private static deps = new Map<any, any>();

  public static get<T>(type: any): T {
    return this.deps.get(type)
      ?? this.add(type, new type());
  }
  
  public static add<T>(type: any, instance: T): T {
    return this.deps
      .set(type, instance)
      .get(type);
  }
}