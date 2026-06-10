import { createAction, props } from '@ngrx/store';
import { JudgeState } from './judge.state';

export const loadJudgeState = createAction('[Judge] Load State');
export const loadJudgeStateSuccess = createAction('[Judge] Load State Success', props<{ data: Partial<JudgeState> }>());
export const loadJudgeStateFailure = createAction('[Judge] Load State Failure', props<{ error: string }>());

export const submitScore = createAction('[Judge] Submit Score', props<{ contestantId: string; values: Record<string, number>; comment: string }>());
export const submitScoreSuccess = createAction('[Judge] Submit Score Success');
export const submitScoreFailure = createAction('[Judge] Submit Score Failure', props<{ error: string }>());

export const navigateContestant = createAction('[Judge] Navigate Contestant', props<{ index: number }>());
export const clearJudgeError = createAction('[Judge] Clear Error');
