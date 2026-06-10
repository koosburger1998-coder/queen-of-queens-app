import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { AppState } from '../../store/app.state';
import { loadAdminState } from '../../store/admin/admin.actions';
import { selectAdminLoaded } from '../../store/admin/admin.selectors';
import { AuthService } from '../../core/auth.service';
import { SocketService } from '../../core/socket.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  loaded$ = this.store.select(selectAdminLoaded);

  navItems = [
    { path: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: 'events', icon: 'event', label: 'Events' },
    { path: 'contestants', icon: 'star', label: 'Contestants' },
    { path: 'judges', icon: 'gavel', label: 'Judges' },
    { path: 'categories', icon: 'category', label: 'Categories' },
    { path: 'competition', icon: 'emoji_events', label: 'Competition' },
    { path: 'scores', icon: 'scoreboard', label: 'Scores' },
    { path: 'settings', icon: 'settings', label: 'Settings' },
  ];

  sidebarOpen = false;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private socket: SocketService,
    public auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (this.auth.adminToken) {
      this.store.dispatch(loadAdminState());
      this.socket.stateChanged.pipe(takeUntil(this.destroy$)).subscribe(() => this.store.dispatch(loadAdminState()));
    }
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  logout() { this.auth.adminLogout(); this.router.navigate(['/']); }
  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }
}
