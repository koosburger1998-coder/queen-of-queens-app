import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { AppState } from '../../store/app.state';
import { loadAudienceState, submitAudienceVote, clearAudienceError } from '../../store/audience/audience.actions';
import { selectAudienceEvent, selectAudienceContestants, selectAudienceCategories, selectGuestSummary, selectHasVoted, selectAudienceLoading, selectAudienceSubmitting, selectAudienceError } from '../../store/audience/audience.selectors';
import { SocketService } from '../../core/socket.service';

function getOrCreateVoterToken(): string {
  let token = localStorage.getItem('qq_voter_token');
  if (!token || token.length < 8) {
    token = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('qq_voter_token', token);
  }
  return token;
}

@Component({
  selector: 'app-audience',
  templateUrl: './audience.component.html',
  styleUrls: ['./audience.component.scss'],
})
export class AudienceComponent implements OnInit, OnDestroy {
  event$ = this.store.select(selectAudienceEvent);
  contestants$ = this.store.select(selectAudienceContestants);
  categories$ = this.store.select(selectAudienceCategories);
  summary$ = this.store.select(selectGuestSummary);
  hasVoted$ = this.store.select(selectHasVoted);
  loading$ = this.store.select(selectAudienceLoading);
  submitting$ = this.store.select(selectAudienceSubmitting);
  error$ = this.store.select(selectAudienceError);

  selections: Record<string, string> = {};
  voterName = '';
  stayAnonymous = false;

  private destroy$ = new Subject<void>();

  constructor(private store: Store<AppState>, private socket: SocketService) {}

  ngOnInit() {
    this.store.dispatch(loadAudienceState());
    this.socket.stateChanged.pipe(takeUntil(this.destroy$)).subscribe(() => this.store.dispatch(loadAudienceState()));
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  select(categoryId: string, contestantId: string) {
    this.selections = { ...this.selections, [categoryId]: contestantId };
  }

  get progressPercent(): number {
    return 0;
  }

  getProgress(categories: any[]): { done: number; total: number; percent: number } {
    if (!categories?.length) return { done: 0, total: 0, percent: 0 };
    const done = categories.filter((c) => this.selections[c.id]).length;
    return { done, total: categories.length, percent: Math.round((done / categories.length) * 100) };
  }

  allSelected(categories: any[]): boolean {
    return categories?.every((c) => this.selections[c.id]) ?? false;
  }

  submit(categories: any[]) {
    if (!this.allSelected(categories)) return;
    this.store.dispatch(submitAudienceVote({
      votes: { ...this.selections },
      voterToken: getOrCreateVoterToken(),
      voterName: this.voterName,
      stayAnonymous: this.stayAnonymous,
    }));
  }

  clearError() { this.store.dispatch(clearAudienceError()); }
  trackById(_: number, item: any) { return item.id; }
}
