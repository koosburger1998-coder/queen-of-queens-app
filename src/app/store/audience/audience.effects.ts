import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AudienceActions from './audience.actions';
import { ApiService } from '../../core/api.service';

@Injectable()
export class AudienceEffects {
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AudienceActions.loadAudienceState),
      switchMap(() =>
        this.api.get<any>('/audience/state').pipe(
          map((data) => AudienceActions.loadAudienceStateSuccess({ data: { event: data.event, contestants: data.contestants, categories: data.categories, summary: data.summary } })),
          catchError((err) => of(AudienceActions.loadAudienceStateFailure({ error: err.error?.message || 'Failed to load.' }))),
        ),
      ),
    ),
  );

  submit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AudienceActions.submitAudienceVote),
      switchMap(({ votes, voterToken, voterName, stayAnonymous }) =>
        this.api.post<any>('/audience/vote', { votes, voterToken, voterName, stayAnonymous }).pipe(
          map((res) => AudienceActions.submitAudienceVoteSuccess({ summary: res.summary })),
          catchError((err) => of(AudienceActions.submitAudienceVoteFailure({ error: err.error?.message || 'Failed to submit vote.' }))),
        ),
      ),
    ),
  );

  constructor(private actions$: Actions, private api: ApiService) {}
}
