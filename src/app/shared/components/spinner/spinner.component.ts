import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `
    <div class="spinner-wrap" [class.overlay]="overlay">
      <mat-spinner [diameter]="diameter" color="accent"></mat-spinner>
      <p *ngIf="label" class="spinner-label">{{ label }}</p>
    </div>
  `,
  styles: [`
    .spinner-wrap { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; padding:24px; }
    .spinner-wrap.overlay { position:fixed; inset:0; background:rgba(5,3,8,.85); z-index:999; }
    .spinner-label { color:rgba(255,255,255,.7); font-size:.9rem; margin:0; }
  `],
})
export class SpinnerComponent {
  @Input() diameter = 48;
  @Input() label = '';
  @Input() overlay = false;
}
