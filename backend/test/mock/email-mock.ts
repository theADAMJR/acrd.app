import { EmailTemplate } from '../../src/api/modules/email/email';

export class EmailMock {
  public emails = new Map<string[], [keyof EmailTemplate, EmailTemplate[keyof EmailTemplate]]>();

  public async send<K extends keyof EmailTemplate>(template: K, ctx: EmailTemplate[K], ...to: string[]) {    
    this.emails.set(to, [template, ctx]);
  }
}