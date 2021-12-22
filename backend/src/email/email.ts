import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { pugEngine } from 'nodemailer-pug-engine';
import { UserTypes } from '@accord/types';

export class Email {
  private email: Mail;

  private readonly templateDir = __dirname + '/templates';  

  constructor() {
    this.email = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      }
    });

    this.email.verify((error) => (error)
      ? log.error(error)
      : log.info('Logged in to email service'));
    
    this.email.use('compile', pugEngine({
      templateDir: this.templateDir,
      pretty: true,
    }));
  }

  public async send<K extends keyof EmailTemplate>(template: K, ctx: EmailTemplate[K], ...to: string[]) {
    await this.email.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: to.join(', '),
      subject: subjects[template],
      template,
      ctx,
    } as any);
  }
}

export interface EmailTemplate {
  'verify': {
    expiresIn: number;
    user: UserTypes.Self;
    code: string;
  };
  'verify-email': this['verify'];
  'forgot-password': this['verify'];
} 

const subjects: { [k in keyof EmailTemplate]: string } = {
  'forgot-password': 'Accord - Forgot Password',
  'verify': 'Accord - Login Verification Code',
  'verify-email': 'Accord - Verify Email',
};
