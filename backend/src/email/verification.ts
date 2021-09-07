import generateInvite from '../data/utils/generate-invite';

export class Verification {
  private codes = new Map<string, VerifyCode>();

  public create(email: string, type: VerifyCode['type'], options?: EmailOptions) {
    options = {
      ...options,
      codeLength: 16,
      expiresIn: 5 * 60 * 1000,
    };
    
    this.codes.delete(email);

    const value = generateInvite(options.codeLength);
    this.codes.set(email, { type, value });

    setTimeout(() => this.codes.delete(email), options.expiresIn);

    return value;
  }

  public get(email: string) {    
    return this.codes.get(email);
  }
  public delete(email: string) {
    this.codes.delete(email);
  }

  public getEmailFromCode(code: string) {    
    return Array
      .from(this.codes.entries())
      .find(([k,v]) => v.value === code)?.[0];
  }
}

interface VerifyCode {
  type: 'LOGIN' | 'VERIFY_EMAIL' | 'FORGOT_PASSWORD';
  value: string;
}

export interface EmailOptions {
  codeLength?: number;
  expiresIn?: number;
}