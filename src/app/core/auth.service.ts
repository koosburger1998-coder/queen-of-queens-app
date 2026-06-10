import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface JudgeSession {
  token: string;
  judge: { id: string; name: string };
}

export interface AdminSession {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private judgeSession$ = new BehaviorSubject<JudgeSession | null>(this.loadJudgeSession());
  private adminSession$ = new BehaviorSubject<AdminSession | null>(this.loadAdminSession());

  constructor(private http: HttpClient) {}

  get judgeSession(): Observable<JudgeSession | null> {
    return this.judgeSession$.asObservable();
  }

  get adminSession(): Observable<AdminSession | null> {
    return this.adminSession$.asObservable();
  }

  get judgeToken(): string | null {
    return this.judgeSession$.value?.token ?? null;
  }

  get adminToken(): string | null {
    return this.adminSession$.value?.token ?? null;
  }

  get currentJudge() {
    return this.judgeSession$.value?.judge ?? null;
  }

  judgeLogin(code: string): Observable<JudgeSession> {
    return this.http.post<JudgeSession>(`${environment.apiUrl}/auth/judge/login`, { code }).pipe(
      tap((session) => {
        localStorage.setItem('qq_judge_session', JSON.stringify(session));
        this.judgeSession$.next(session);
      }),
    );
  }

  adminLogin(code: string): Observable<AdminSession> {
    return this.http.post<AdminSession>(`${environment.apiUrl}/auth/admin/login`, { code }).pipe(
      tap((session) => {
        localStorage.setItem('qq_admin_session', JSON.stringify(session));
        this.adminSession$.next(session);
      }),
    );
  }

  judgeLogout() {
    localStorage.removeItem('qq_judge_session');
    this.judgeSession$.next(null);
  }

  adminLogout() {
    localStorage.removeItem('qq_admin_session');
    this.adminSession$.next(null);
  }

  private loadJudgeSession(): JudgeSession | null {
    try {
      const raw = localStorage.getItem('qq_judge_session');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private loadAdminSession(): AdminSession | null {
    try {
      const raw = localStorage.getItem('qq_admin_session');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
