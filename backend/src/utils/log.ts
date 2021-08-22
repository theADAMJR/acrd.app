import 'colors';

export default class Log {
  static getSource(src?: string) {
    return src?.toUpperCase() || 'OTHER';
  }  
  static info(message?: any, src?: string) {
    console.log(`[${
      this.toHHMMSS(new Date()).cyan
    }] INFO [${this.getSource(src).blue}] ${message?.toString().blue}`)
  }
  static error(err?: any, src?: string) {
    const message: string = err?.message || err || 'Unknown error';
    console.error(`[${
      this.toHHMMSS(new Date()).cyan
    }] ERROR [${this.getSource(src).blue}] ${message.red}`)
  }

  private static toHHMMSS(time: Date) {
    let hours = time.getHours().toString().padStart(2, '0');
    let minutes = time.getMinutes().toString().padStart(2, '0');
    let seconds = time.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}
