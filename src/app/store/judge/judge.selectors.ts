import { createFeatureSelector, createSelector } from '@ngrx/store';
import { JudgeState } from './judge.state';

export const selectJudgeFeature = createFeatureSelector<JudgeState>('judge');

export const selectJudgeEvent = createSelector(selectJudgeFeature, (s) => s.event);
export const selectJudgeCategories = createSelector(selectJudgeFeature, (s) => s.categories);
export const selectJudgeContestants = createSelector(selectJudgeFeature, (s) => s.contestants);
export const selectMyScores = createSelector(selectJudgeFeature, (s) => s.myScores);
export const selectCanJudge = createSelector(selectJudgeFeature, (s) => s.canJudge);
export const selectCurrentIndex = createSelector(selectJudgeFeature, (s) => s.currentIndex);
export const selectJudgeLoading = createSelector(selectJudgeFeature, (s) => s.loading);
export const selectJudgeSubmitting = createSelector(selectJudgeFeature, (s) => s.submitting);
export const selectJudgeError = createSelector(selectJudgeFeature, (s) => s.error);

export const selectCurrentContestant = createSelector(
  selectJudgeContestants,
  selectCurrentIndex,
  (contestants, index) => contestants[index] ?? null,
);

export const selectProgress = createSelector(
  selectJudgeContestants,
  selectMyScores,
  (contestants, scores) => {
    const completed = contestants.filter((c) => scores.some((s) => s.contestantId === c.id)).length;
    const total = contestants.length;
    return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  },
);

export const selectScoreForCurrent = createSelector(
  selectCurrentContestant,
  selectMyScores,
  (contestant, scores) => (contestant ? scores.find((s) => s.contestantId === contestant.id) ?? null : null),
);
