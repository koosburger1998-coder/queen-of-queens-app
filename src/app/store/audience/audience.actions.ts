import { createAction, props } from '@ngrx/store';
import { AudienceState } from './audience.state';

export const loadAudienceState = createAction('[Audience] Load State');
export const loadAudienceStateSuccess = createAction('[Audience] Load State Success', props<{ data: Partial<AudienceState> }>());
export const loadAudienceStateFailure = createAction('[Audience] Load State Failure', props<{ error: string }>());

export const submitAudienceVote = createAction('[Audience] Submit Vote', props<{ votes: Record<string, string>; voterToken: string; voterName: string; stayAnonymous: boolean }>());
export const submitAudienceVoteSuccess = createAction('[Audience] Submit Vote Success', props<{ summary: any[] }>());
export const submitAudienceVoteFailure = createAction('[Audience] Submit Vote Failure', props<{ error: string }>());

export const clearAudienceError = createAction('[Audience] Clear Error');
