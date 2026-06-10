import { createReducer, on } from '@ngrx/store';
import { initialJudgeState } from './judge.state';
import * as JudgeActions from './judge.actions';

export const judgeReducer = createReducer(
  initialJudgeState,

  on(JudgeActions.loadJudgeState, (state) => ({ ...state, loading: true, error: null })),
  on(JudgeActions.loadJudgeStateSuccess, (state, { data }) => ({
    ...state, ...data, loading: false, error: null,
  })),
  on(JudgeActions.loadJudgeStateFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(JudgeActions.submitScore, (state) => ({ ...state, submitting: true, error: null })),
  on(JudgeActions.submitScoreSuccess, (state) => ({ ...state, submitting: false })),
  on(JudgeActions.submitScoreFailure, (state, { error }) => ({ ...state, submitting: false, error })),

  on(JudgeActions.navigateContestant, (state, { index }) => ({ ...state, currentIndex: index })),
  on(JudgeActions.clearJudgeError, (state) => ({ ...state, error: null })),
);
