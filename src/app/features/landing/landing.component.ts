import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { SocketService } from '../../core/socket.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit, OnDestroy {
  event: any = null;
  competition: any = null;
  loading = true;
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient, private socket: SocketService) {}

  ngOnInit() {
    this.load();
    this.socket.stateChanged.pipe(takeUntil(this.destroy$)).subscribe(() => this.load());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load() {
    this.http.get<any>(`${environment.apiUrl}/audience/state`).subscribe({
      next: (data) => {
        this.event = data.event;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }
}
