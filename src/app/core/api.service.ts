import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  private judgeHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.judgeToken}` });
  }

  private adminHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.adminToken}` });
  }

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}${path}`);
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${path}`, body);
  }

  judgeGet<T>(path: string): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}${path}`, { headers: this.judgeHeaders() });
  }

  judgePost<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${path}`, body, { headers: this.judgeHeaders() });
  }

  adminGet<T>(path: string): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}${path}`, { headers: this.adminHeaders() });
  }

  adminPost<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${path}`, body, { headers: this.adminHeaders() });
  }

  adminPut<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${environment.apiUrl}${path}`, body, { headers: this.adminHeaders() });
  }

  adminDelete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${environment.apiUrl}${path}`, { headers: this.adminHeaders() });
  }

  adminGetCsv(path: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}${path}`, {
      headers: this.adminHeaders(),
      responseType: 'blob',
    });
  }
}
