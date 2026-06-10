import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { updateAdminSettings } from '../../../store/admin/admin.actions';
import { selectAdminSaving, selectAdminError } from '../../../store/admin/admin.selectors';

@Component({
  selector: 'app-admin-settings',
  template: `
    <div class="admin-section">
      <h2>Settings</h2>
      <div class="qq-card">
        <h3>Admin Code</h3>
        <p class="qq-muted">Change the admin login code. All admins will need to use the new code immediately.</p>
        <div class="settings-row">
          <input class="qq-input" [type]="showNew ? 'text' : 'password'" [(ngModel)]="newCode" placeholder="New admin code (min 6 chars)">
          <button mat-icon-button type="button" (click)="showNew = !showNew">
            <mat-icon>{{ showNew ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        </div>
        <div class="qq-error" *ngIf="error$ | async as err">{{ err }}</div>
        <button mat-raised-button color="primary" [disabled]="!newCode || newCode.length < 6 || (saving$ | async)"
          (click)="save()">
          <mat-progress-spinner *ngIf="saving$ | async" diameter="18" mode="indeterminate"></mat-progress-spinner>
          Update Code
        </button>
        <div class="qq-muted settings-saved" *ngIf="saved">Saved!</div>
      </div>
    </div>
  `,
  styles: [`
    .admin-section { max-width: 520px; }
    h2 { margin: 0 0 20px; font-size: 1.4rem; }
    .settings-row { display: flex; gap: 8px; align-items: center; margin-bottom: 14px; }
    .settings-saved { margin-top: 10px; color: var(--qq-green); }
  `],
})
export class AdminSettingsComponent {
  newCode = '';
  showNew = false;
  saved = false;
  saving$ = this.store.select(selectAdminSaving);
  error$ = this.store.select(selectAdminError);

  constructor(private store: Store<AppState>) {}

  save() {
    if (!this.newCode || this.newCode.length < 6) return;
    this.store.dispatch(updateAdminSettings({ adminCode: this.newCode }));
    this.saved = true;
    this.newCode = '';
    setTimeout(() => (this.saved = false), 3000);
  }
}
