import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private socket: Socket;
  private stateChanged$ = new Subject<void>();

  constructor() {
    this.socket = io(environment.socketUrl, { transports: ['websocket', 'polling'] });
    this.socket.on('state:changed', () => this.stateChanged$.next());
  }

  get stateChanged(): Observable<void> {
    return this.stateChanged$.asObservable();
  }

  ngOnDestroy() {
    this.socket.disconnect();
    this.stateChanged$.complete();
  }
}
