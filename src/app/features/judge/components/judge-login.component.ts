import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-judge-login',
  template: `
    <div class="qq-login">
      <div class="qq-card qq-card--login">
        <img src="assets/logo.svg" alt="Logo" class="qq-login__logo">
        <h1>Queen of Queens</h1>
        <p class="qq-muted">Judge Voting App</p>
        <hr class="qq-divider">
        <p class="qq-small">Enter your private judge code to start scoring.</p>
        <div class="qq-field">
          <label class="qq-label">Judge code</label>
          <div class="qq-passcode-wrap">
            <input [type]="showCode ? 'text' : 'password'"
              [(ngModel)]="code" class="qq-input"
              placeholder="Enter judge code"
              autocomplete="off" autocapitalize="none" spellcheck="false"
              (keydown.enter)="login()" #codeInput>
            <button type="button" class="qq-eye" (click)="showCode = !showCode">
              <mat-icon>{{ showCode ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </div>
        </div>
        <div class="qq-error" *ngIf="error">{{ error }}</div>
        <button mat-raised-button color="primary" class="qq-btn-block" (click)="login()" [disabled]="loading">
          <mat-progress-spinner *ngIf="loading" diameter="20" mode="indeterminate"></mat-progress-spinner>
          Start Voting
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./judge-login.component.scss'],
})
export class JudgeLoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();
  code = '';
  showCode = false;
  loading = false;
  error = '';

  constructor(private auth: AuthService) {}

  login() {
    this.error = '';
    if (!this.code.trim()) { this.error = 'Please enter your judge code.'; return; }
    this.loading = true;
    this.auth.judgeLogin(this.code.trim()).subscribe({
      next: () => { this.loading = false; this.loginSuccess.emit(); },
      error: (err) => { this.loading = false; this.error = err.error?.message || 'Invalid judge code.'; },
    });
  }
}
