import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { loadAdminState } from '../../../store/admin/admin.actions';

@Component({
  selector: 'app-admin-login',
  template: `
    <div class="admin-login">
      <div class="qq-bg"></div>
      <div class="qq-stars"></div>
      <div class="qq-card admin-login__card">
        <img src="assets/logo.svg" class="admin-login__logo" onerror="this.style.display='none'" alt="">
        <h2>Admin Access</h2>
        <p class="qq-muted">Enter the admin code to continue.</p>
        <div class="qq-field">
          <input class="qq-input" [type]="showCode ? 'text' : 'password'" [(ngModel)]="code" placeholder="Admin code" (keyup.enter)="login()">
          <button class="qq-field__toggle" type="button" (click)="showCode = !showCode">
            <mat-icon>{{ showCode ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        </div>
        <div class="qq-error" *ngIf="error">{{ error }}</div>
        <button mat-raised-button color="primary" class="qq-btn-block" [disabled]="loading" (click)="login()">
          <mat-progress-spinner *ngIf="loading" diameter="18" mode="indeterminate"></mat-progress-spinner>
          Sign In
        </button>
      </div>
    </div>
  `,
  styles: [`
    .admin-login { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; position: relative; }
    .admin-login__card { width: min(420px, 100%); text-align: center; h2 { margin: 10px 0 6px; } }
    .admin-login__logo { width: 80px; height: 80px; border-radius: 18px; object-fit: cover; }
    .qq-field { position: relative; margin-bottom: 14px; }
    .qq-field__toggle { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: rgba(255,255,255,0.5); cursor: pointer; display: flex; align-items: center; }
  `],
})
export class AdminLoginComponent {
  code = '';
  showCode = false;
  loading = false;
  error = '';

  constructor(private auth: AuthService, private store: Store<AppState>, private router: Router) {}

  login() {
    if (!this.code.trim()) return;
    this.loading = true; this.error = '';
    this.auth.adminLogin(this.code.trim()).subscribe({
      next: () => { this.loading = false; this.store.dispatch(loadAdminState()); },
      error: (err: any) => { this.loading = false; this.error = err?.error?.message || 'Invalid admin code'; },
    });
  }
}
