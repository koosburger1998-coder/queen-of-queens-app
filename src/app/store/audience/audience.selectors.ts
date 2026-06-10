import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AudienceState } from './audience.state';

export const selectAudienceFeature = createFeatureSelector<AudienceState>('audience');
export const selectAudienceEvent = createSelector(selectAudienceFeature, (s) => s.event);
export const selectAudienceContestants = createSelector(selectAudienceFeature, (s) => s.contestants);
export const selectAudienceCategories = createSelector(selectAudienceFeature, (s) => s.categories);
export const selectGuestSummary = createSelector(selectAudienceFeature, (s) => s.summary);
export const selectHasVoted = createSelector(selectAudienceFeature, (s) => s.hasVoted);
export const selectAudienceLoading = createSelector(selectAudienceFeature, (s) => s.loading);
export const selectAudienceSubmitting = createSelector(selectAudienceFeature, (s) => s.submitting);
export const selectAudienceError = createSelector(selectAudienceFeature, (s) => s.error);
