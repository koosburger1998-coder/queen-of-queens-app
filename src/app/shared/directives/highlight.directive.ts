import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({ selector: '[appHighlight]' })
export class HighlightDirective implements OnInit {
  @Input() appHighlight: 'pink' | 'gold' | 'green' = 'pink';

  private readonly colors = {
    pink: 'rgba(255,31,143,.18)',
    gold: 'rgba(255,209,102,.18)',
    green: 'rgba(49,208,170,.18)',
  };

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'background .15s ease');
  }

  @HostListener('mouseenter')
  onEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'background', this.colors[this.appHighlight]);
  }

  @HostListener('mouseleave')
  onLeave() {
    this.renderer.removeStyle(this.el.nativeElement, 'background');
  }
}
