import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AdminActions from './admin.actions';
import { ApiService } from '../../core/api.service';

const reload = (api: ApiService) =>
  api.adminGet<any>('/admin/state').pipe(
    map((data) => AdminActions.loadAdminStateSuccess({ data })),
    catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Request failed.' }))),
  );

@Injectable()
export class AdminEffects {
  load$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.loadAdminState),
    switchMap(() => reload(this.api)),
  ));

  // Events
  createEvent$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.createEvent),
    switchMap(({ data }) => this.api.adminPost('/events', data).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  updateEvent$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.updateEvent),
    switchMap(({ eventId, data }) => this.api.adminPut(`/events/${eventId}`, data).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  deleteEvent$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.deleteEvent),
    switchMap(({ eventId }) => this.api.adminDelete(`/events/${eventId}`).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  activateEvent$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.activateEvent),
    switchMap(({ eventId }) => this.api.adminPost(`/events/${eventId}/activate`, {}).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  lockScoring$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.lockScoring),
    switchMap(({ eventId }) => this.api.adminPut(`/events/${eventId}`, { scoringLocked: true }).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  unlockScoring$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.unlockScoring),
    switchMap(({ eventId }) => this.api.adminPut(`/events/${eventId}`, { scoringLocked: false }).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  lockGuestVoting$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.lockGuestVoting),
    switchMap(({ eventId }) => this.api.adminPut(`/events/${eventId}`, { guestVotingLocked: true }).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  unlockGuestVoting$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.unlockGuestVoting),
    switchMap(({ eventId }) => this.api.adminPut(`/events/${eventId}`, { guestVotingLocked: false }).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  // Event assignments
  addJudgeToEvent$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.addJudgeToEvent),
    switchMap(({ eventId, judgeId }) => this.api.adminPost(`/events/${eventId}/judges`, { judgeId }).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  removeJudgeFromEvent$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.removeJudgeFromEvent),
    switchMap(({ eventId, judgeId }) => this.api.adminDelete(`/events/${eventId}/judges/${judgeId}`).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  addContestantToEvent$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.addContestantToEvent),
    switchMap(({ eventId, contestantId }) => this.api.adminPost(`/events/${eventId}/contestants`, { contestantId }).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  removeContestantFromEvent$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.removeContestantFromEvent),
    switchMap(({ eventId, contestantId }) => this.api.adminDelete(`/events/${eventId}/contestants/${contestantId}`).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  // Contestants
  createContestant$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.createContestant),
    switchMap(({ data }) => this.api.adminPost('/contestants', data).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  updateContestant$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.updateContestant),
    switchMap(({ contestantId, data }) => this.api.adminPut(`/contestants/${contestantId}`, data).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  deleteContestant$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.deleteContestant),
    switchMap(({ contestantId }) => this.api.adminDelete(`/contestants/${contestantId}`).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  // Judges
  createJudge$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.createJudge),
    switchMap(({ data }) => this.api.adminPost('/judges', data).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  updateJudge$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.updateJudge),
    switchMap(({ judgeId, data }) => this.api.adminPut(`/judges/${judgeId}`, data).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  deleteJudge$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.deleteJudge),
    switchMap(({ judgeId }) => this.api.adminDelete(`/judges/${judgeId}`).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  // Categories
  createCategory$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.createCategory),
    switchMap(({ data }) => this.api.adminPost('/categories/judge', data).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  updateCategory$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.updateCategory),
    switchMap(({ categoryId, data }) => this.api.adminPut(`/categories/judge/${categoryId}`, data).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  deleteCategory$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.deleteCategory),
    switchMap(({ categoryId }) => this.api.adminDelete(`/categories/judge/${categoryId}`).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  createGuestCategory$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.createGuestCategory),
    switchMap(({ data }) => this.api.adminPost('/categories/guest', data).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  updateGuestCategory$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.updateGuestCategory),
    switchMap(({ categoryId, data }) => this.api.adminPut(`/categories/guest/${categoryId}`, data).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  deleteGuestCategory$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.deleteGuestCategory),
    switchMap(({ categoryId }) => this.api.adminDelete(`/categories/guest/${categoryId}`).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  // Scores
  deleteScore$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.deleteScore),
    switchMap(({ scoreId }) => this.api.adminDelete(`/scores/admin/${scoreId}`).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  resetEventScores$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.resetEventScores),
    switchMap(({ eventId }) => this.api.adminPost(`/scores/admin/reset/${eventId}`, {}).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  exportCsv$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.exportCsv),
    switchMap(({ eventId }) => this.api.adminGetCsv(`/admin/export/${eventId}/results.csv`).pipe(
      tap((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `results-${eventId}.csv`;
        a.click(); URL.revokeObjectURL(url);
      }),
      map(() => AdminActions.loadAdminState()),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Export failed.' }))),
    )),
  ));

  // Competition
  setupRounds$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.setupRounds),
    switchMap(() => this.api.adminPost('/admin/competition/setup', {}).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  populateNextRound$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.populateNextRound),
    switchMap(({ roundKey }) => this.api.adminPost(`/admin/competition/populate/${roundKey}`, {}).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  setEventWinners$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.setEventWinners),
    switchMap(({ eventId, winners, wildcards }) =>
      this.api.adminPost(`/admin/events/${eventId}/winners`, { winners, wildcards }).pipe(
        switchMap(() => reload(this.api)),
        catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
      ),
    ),
  ));

  updateCompetition$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.updateCompetition),
    switchMap(({ data }) => this.api.adminPut('/admin/competition', data).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  // Settings
  updateAdminSettings$ = createEffect(() => this.actions$.pipe(
    ofType(AdminActions.updateAdminSettings),
    switchMap(({ adminCode }) => this.api.adminPut('/admin/settings', { adminCode }).pipe(
      switchMap(() => reload(this.api)),
      catchError((err) => of(AdminActions.adminActionFailure({ error: err.error?.message || 'Failed.' }))),
    )),
  ));

  constructor(private actions$: Actions, private api: ApiService) {}
}
