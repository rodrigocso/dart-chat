import { Injectable } from '@angular/core';

@Injectable()
export class ProgressBarService {
  private border: HTMLElement;
  private bar: HTMLElement;

  setElement(element: HTMLElement): void {
    this.border = element;
    this.bar = element.querySelector('div') as HTMLElement;
    this.setProgress(0);
  }

  show(): void {
    this.border.hidden = false;
    this.bar.hidden = false;
  }

  hide(): void {
    this.border.hidden = true;
    this.border.hidden = true;
  }

  setProgress(p: number) {
    if (p > 100) p = 100;
    if (p < 0) p = 0;

    this.bar.style.width = p + '%';
  }
}
