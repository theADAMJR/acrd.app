import { Injectable, ErrorHandler } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class AlertErrorHandler implements ErrorHandler {
  async handleError(error: Error) {
    try {
      console.log(error.stack);

      const key = localStorage.getItem('key');
      await fetch(`${environment.endpoint}/error?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: error.message }),
      });
    } finally {
      throw error;
    }
  }
}