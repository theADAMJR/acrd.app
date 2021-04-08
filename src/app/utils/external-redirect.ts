import { Component } from '@angular/core';

export function externalRedirect(url: string) {
  @Component({})
  class RedirectComponent {
    constructor() {
      window.location.href = url;
    }
  }
  return RedirectComponent;
}