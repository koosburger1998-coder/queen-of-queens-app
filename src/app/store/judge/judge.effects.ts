import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import * as JudgeActions from './judge.actions';
import { ApiService } from '../../core/api.service';
import { AppState } from '../app.state';
import { selectJudgeContestants, selectMyScores } from './judge.selectors';

@Injectable()
export class JudgeEffects {
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JudgeActions.loadJudgeState),
      switchMap(() =>
        this.api.judgeGet<any>('/scores/judge/state').pipe(
          map((data) => {
            const contestants = data.contestants || [];
            const myScores = data.myScores || [];
            const firstMissing = contestants.findIndex((c: any) => !myScores.some((s: any) => s.contestantId === c.id));
            return JudgeActions.loadJudgeStateSuccess({
              data: {
                event: data.event,
                categories: data.categories,
                contestants,
                myScores,
                canJudge: data.canJudge,
                currentIndex: firstMissing >= 0 ? firstMissing : 0,
              },
            });
          }),
          catchError((err) => of(JudgeActions.loadJudgeStateFailure({ error: err.error?.message || 'Failed to load state.' }))),
        ),
      ),
    ),
  );

  submit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JudgeActions.submitScore),
      switchMap(({ contestantId, values, comment }) =>
        this.api.judgePost<any>('/scores/judge/submit', { contestantId, values, comment }).pipe(
          switchMap(() =>
            this.api.judgeGet<any>('/scores/judge/state').pipe(
              map((data) => {
                const contestants = data.contestants || [];
                const myScores = data.myScores || [];
                const nextMissing = contestants.findIndex((c: any) => !myScores.some((s: any) => s.contestantId === c.id));
                this.store.dispatch(JudgeActions.loadJudgeStateSuccess({
                  data: { event: data.event, categories: data.categories, contestants, myScores, canJudge: data.canJudge, currentIndex: nextMissing >= 0 ? nextMissing : 0 },
                }));
                return JudgeActions.submitScoreSuccess();
              }),
              catchError(() => of(JudgeActions.submitScoreSuccess())),
            ),
          ),
          catchError((err) => of(JudgeActions.submitScoreFailure({ error: err.error?.message || 'Failed to submit score.' }))),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private api: ApiService,
    private store: Store<AppState>,
  ) {}
}
