import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[dcAutoScroll]',
  host: {
    '(scroll)': 'onScroll()'
  }
})
export class AutoScrollDirective {
  private el: Element;
  private isLocked: boolean = false;
  private observer: MutationObserver;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  onScroll(event: Event): void {
    if (this.el.scrollTop > 0) {
      this.isLocked = (this.el.scrollTop / this.el.scrollHeight) < 0.5;
    }
  }

  ngAfterContentInit(): void {
    this.el.scrollTop = this.el.scrollHeight;

    this.observer = new MutationObserver((mutations) => {
      if (!this.isLocked) {
        this.el.scrollTop = this.el.scrollHeight;
      }
    });

    this.observer.observe(this.el, { childList: true, subtree: true });
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }
}
