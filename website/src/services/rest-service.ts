export abstract class RESTService {
  protected abstract endpoint: string;

  private async fetch(route: string, init?: RequestInit) {
    const res = await fetch(`${process.env.PORT}/${this.endpoint}/${route}`, init);
    return await res.json();
  }

  protected get(route: string) {
    return this.fetch(route);
  }

  protected post(route: string, value: object) {
    return this.fetch(route, {
      method: 'POST',
      body: JSON.stringify(value),
    });
  }

  protected patch(route: string, value: object) {
    return this.fetch(route, {
      method: 'PATCH',
      body: JSON.stringify(value),
    });
  }

  protected delete(route: string) {
    return this.fetch(route, {
      method: 'DELETE'
    });
  }
}