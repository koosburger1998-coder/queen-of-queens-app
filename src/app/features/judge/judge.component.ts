import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { AppState } from '../../store/app.state';
import { loadJudgeState, submitScore, navigateContestant, clearJudgeError } from '../../store/judge/judge.actions';
import { selectJudgeEvent, selectJudgeContestants, selectJudgeCategories, selectMyScores, selectCurrentIndex, selectCurrentContestant, selectScoreForCurrent, selectProgress, selectJudgeLoading, selectJudgeSubmitting, selectJudgeError } from '../../store/judge/judge.selectors';
import { AuthService } from '../../core/auth.service';
import { SocketService } from '../../core/socket.service';

@Component({
  selector: 'app-judge',
  templateUrl: './judge.component.html',
  styleUrls: ['./judge.component.scss'],
})
export class JudgeComponent implements OnInit, OnDestroy {
  event$ = this.store.select(selectJudgeEvent);
  contestants$ = this.store.select(selectJudgeContestants);
  categories$ = this.store.select(selectJudgeCategories);
  currentContestant$ = this.store.select(selectCurrentContestant);
  currentScore$ = this.store.select(selectScoreForCurrent);
  progress$ = this.store.select(selectProgress);
  myScores$ = this.store.select(selectMyScores);
  loading$ = this.store.select(selectJudgeLoading);
  submitting$ = this.store.select(selectJudgeSubmitting);
  error$ = this.store.select(selectJudgeError);
  currentIndex$ = this.store.select(selectCurrentIndex);

  draftValues: Record<string, number> = {};
  draftComment = '';
  isLoggedIn = false;
  reviewing = false;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    readonly auth: AuthService,
    private socket: SocketService,
  ) {}

  ngOnInit() {
    this.isLoggedIn = !!this.auth.judgeToken;

    if (this.isLoggedIn) {
      this.store.dispatch(loadJudgeState());
    }

    this.socket.stateChanged.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.isLoggedIn) this.store.dispatch(loadJudgeState());
    });

    let lastContestantId: string | null = null;

    // Reset draft whenever the contestant changes — even if both have no score
    // (currentScore$ won't re-emit null→null, so we can't rely on it alone)
    this.currentContestant$.pipe(takeUntil(this.destroy$)).subscribe((contestant) => {
      if (contestant?.id !== lastContestantId) {
        lastContestantId = contestant?.id ?? null;
        this.draftValues = {};
        this.draftComment = '';
      }
    });

    // Populate from a saved score once it becomes available for the current contestant
    this.currentScore$.pipe(takeUntil(this.destroy$)).subscribe((score) => {
      if (score) {
        this.draftValues = { ...score.values };
        this.draftComment = score.comment || '';
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLoginSuccess() {
    this.isLoggedIn = true;
    this.store.dispatch(loadJudgeState());
  }

  onLogout() {
    this.reviewing = false;
    this.auth.judgeLogout();
    this.isLoggedIn = false;
  }

  setScore(categoryId: string, value: number) {
    this.draftValues = { ...this.draftValues, [categoryId]: value };
  }

  get totalScore(): number {
    return Object.values(this.draftValues).reduce((s, v) => s + v, 0);
  }

  get requiresComment(): boolean {
    return Object.values(this.draftValues).some((v) => v === 1 || v === 10);
  }

  submitScore(contestantId: string, categories: any[]) {
    const allFilled = categories.every((c) => this.draftValues[c.id] !== undefined);
    if (!allFilled) return;
    this.store.dispatch(submitScore({ contestantId, values: { ...this.draftValues }, comment: this.draftComment }));
  }

  navigate(index: number, contestants: any[]) {
    this.reviewing = true;
    const clamped = Math.max(0, Math.min(index, contestants.length - 1));
    this.store.dispatch(navigateContestant({ index: clamped }));
  }

  hasSubmitted(contestantId: string, scores: any[]): boolean {
    return scores.some((s) => s.contestantId === contestantId);
  }

  clearError() {
    this.store.dispatch(clearJudgeError());
  }

  allScored(categories: any[]): boolean {
    return categories?.every((c) => this.draftValues[c.id] !== undefined) ?? false;
  }

  allDone(progress: any): boolean {
    return progress?.total > 0 && progress?.completed === progress?.total;
  }

  trackById(_: number, item: any) { return item.id; }
}
