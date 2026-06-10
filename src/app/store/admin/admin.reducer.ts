import { createReducer, on } from '@ngrx/store';
import { initialAdminState } from './admin.state';
import * as AdminActions from './admin.actions';

export const adminReducer = createReducer(
  initialAdminState,
  on(AdminActions.loadAdminState, (state) => ({ ...state, loading: true, saving: false, error: null })),
  on(AdminActions.loadAdminStateSuccess, (state, { data }) => ({
    ...state, ...data, loading: false, loaded: true, error: null,
  })),
  on(AdminActions.loadAdminStateFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(
    AdminActions.createEvent, AdminActions.updateEvent, AdminActions.deleteEvent,
    AdminActions.activateEvent, AdminActions.lockScoring, AdminActions.unlockScoring,
    AdminActions.lockGuestVoting, AdminActions.unlockGuestVoting,
    AdminActions.createContestant, AdminActions.updateContestant, AdminActions.deleteContestant,
    AdminActions.createJudge, AdminActions.updateJudge, AdminActions.deleteJudge,
    AdminActions.createCategory, AdminActions.updateCategory, AdminActions.deleteCategory,
    AdminActions.createGuestCategory, AdminActions.updateGuestCategory, AdminActions.deleteGuestCategory,
    AdminActions.deleteScore, AdminActions.resetEventScores, AdminActions.exportCsv,
    AdminActions.setupRounds, AdminActions.populateNextRound, AdminActions.setEventWinners,
    AdminActions.updateCompetition, AdminActions.updateAdminSettings,
    (state) => ({ ...state, saving: true, error: null }),
  ),
  on(AdminActions.adminActionFailure, (state, { error }) => ({ ...state, saving: false, error })),
  on(AdminActions.clearAdminError, (state) => ({ ...state, error: null })),
);
