import { createReducer, on } from '@ngrx/store';
import { initialAudienceState } from './audience.state';
import * as AudienceActions from './audience.actions';

export const audienceReducer = createReducer(
  initialAudienceState,
  on(AudienceActions.loadAudienceState, (state) => ({ ...state, loading: true, error: null })),
  on(AudienceActions.loadAudienceStateSuccess, (state, { data }) => ({ ...state, ...data, loading: false })),
  on(AudienceActions.loadAudienceStateFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(AudienceActions.submitAudienceVote, (state) => ({ ...state, submitting: true, error: null })),
  on(AudienceActions.submitAudienceVoteSuccess, (state, { summary }) => ({ ...state, submitting: false, hasVoted: true, summary })),
  on(AudienceActions.submitAudienceVoteFailure, (state, { error }) => ({ ...state, submitting: false, error })),
  on(AudienceActions.clearAudienceError, (state) => ({ ...state, error: null })),
);
