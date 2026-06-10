export interface AdminState {
  loaded: boolean;
  loading: boolean;
  saving: boolean;
  error: string | null;
  activeEvent: any | null;
  events: any[];
  competitionEvents: any[];
  competition: any | null;
  contestants: any[];
  allContestants: any[];
  judges: any[];
  allJudges: any[];
  categories: any[];
  guestCategories: any[];
  scores: any[];
  guestSummary: any[];
  leaderboard: any[];
  missingVotes: any[];
  settings: { adminCode?: string };
}

export const initialAdminState: AdminState = {
  loaded: false,
  loading: false,
  saving: false,
  error: null,
  activeEvent: null,
  events: [],
  competitionEvents: [],
  competition: null,
  contestants: [],
  allContestants: [],
  judges: [],
  allJudges: [],
  categories: [],
  guestCategories: [],
  scores: [],
  guestSummary: [],
  leaderboard: [],
  missingVotes: [],
  settings: {},
};
