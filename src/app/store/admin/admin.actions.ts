import { createAction, props } from '@ngrx/store';

export const loadAdminState = createAction('[Admin] Load State');
export const loadAdminStateSuccess = createAction('[Admin] Load State Success', props<{ data: any }>());
export const loadAdminStateFailure = createAction('[Admin] Load State Failure', props<{ error: string }>());

// Events
export const createEvent = createAction('[Admin] Create Event', props<{ data: any }>());
export const updateEvent = createAction('[Admin] Update Event', props<{ eventId: string; data: any }>());
export const deleteEvent = createAction('[Admin] Delete Event', props<{ eventId: string }>());
export const activateEvent = createAction('[Admin] Activate Event', props<{ eventId: string }>());
export const lockScoring = createAction('[Admin] Lock Scoring', props<{ eventId: string }>());
export const unlockScoring = createAction('[Admin] Unlock Scoring', props<{ eventId: string }>());
export const lockGuestVoting = createAction('[Admin] Lock Guest Voting', props<{ eventId: string }>());
export const unlockGuestVoting = createAction('[Admin] Unlock Guest Voting', props<{ eventId: string }>());

// Event assignments
export const addJudgeToEvent = createAction('[Admin] Add Judge To Event', props<{ eventId: string; judgeId: string }>());
export const removeJudgeFromEvent = createAction('[Admin] Remove Judge From Event', props<{ eventId: string; judgeId: string }>());
export const addContestantToEvent = createAction('[Admin] Add Contestant To Event', props<{ eventId: string; contestantId: string }>());
export const removeContestantFromEvent = createAction('[Admin] Remove Contestant From Event', props<{ eventId: string; contestantId: string }>());

// Contestants
export const createContestant = createAction('[Admin] Create Contestant', props<{ data: any }>());
export const updateContestant = createAction('[Admin] Update Contestant', props<{ contestantId: string; data: any }>());
export const deleteContestant = createAction('[Admin] Delete Contestant', props<{ contestantId: string }>());

// Judges
export const createJudge = createAction('[Admin] Create Judge', props<{ data: any }>());
export const updateJudge = createAction('[Admin] Update Judge', props<{ judgeId: string; data: any }>());
export const deleteJudge = createAction('[Admin] Delete Judge', props<{ judgeId: string }>());

// Categories (judge)
export const createCategory = createAction('[Admin] Create Category', props<{ data: any }>());
export const updateCategory = createAction('[Admin] Update Category', props<{ categoryId: string; data: any }>());
export const deleteCategory = createAction('[Admin] Delete Category', props<{ categoryId: string }>());

// Categories (guest)
export const createGuestCategory = createAction('[Admin] Create Guest Category', props<{ data: any }>());
export const updateGuestCategory = createAction('[Admin] Update Guest Category', props<{ categoryId: string; data: any }>());
export const deleteGuestCategory = createAction('[Admin] Delete Guest Category', props<{ categoryId: string }>());

// Scores
export const deleteScore = createAction('[Admin] Delete Score', props<{ scoreId: string }>());
export const resetEventScores = createAction('[Admin] Reset Event Scores', props<{ eventId: string }>());
export const exportCsv = createAction('[Admin] Export CSV', props<{ eventId: string }>());

// Competition
export const setupRounds = createAction('[Admin] Setup Rounds');
export const populateNextRound = createAction('[Admin] Populate Next Round', props<{ roundKey: string }>());
export const setEventWinners = createAction('[Admin] Set Event Winners', props<{ eventId: string; winners: string[]; wildcards: string[] }>());
export const updateCompetition = createAction('[Admin] Update Competition', props<{ data: any }>());

// Settings
export const updateAdminSettings = createAction('[Admin] Update Settings', props<{ adminCode: string }>());

// Generic
export const adminActionFailure = createAction('[Admin] Action Failure', props<{ error: string }>());
export const clearAdminError = createAction('[Admin] Clear Error');
