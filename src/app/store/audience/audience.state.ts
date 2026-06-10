export interface AudienceContestant {
  id: string;
  stageName: string;
  style: string;
  order: number;
}

export interface GuestCategory {
  id: string;
  name: string;
  order: number;
}

export interface GuestSummaryRow {
  contestantId: string;
  contestantName: string;
  order: number;
  points: number;
}

export interface GuestSummary {
  categoryId: string;
  categoryName: string;
  totalVotes: number;
  leader: GuestSummaryRow | null;
  totals: GuestSummaryRow[];
}

export interface AudienceEvent {
  id: string;
  name: string;
  date: string;
  venue: string;
  guestVotingLocked: boolean;
}

export interface AudienceState {
  event: AudienceEvent | null;
  contestants: AudienceContestant[];
  categories: GuestCategory[];
  summary: GuestSummary[];
  hasVoted: boolean;
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

export const initialAudienceState: AudienceState = {
  event: null,
  contestants: [],
  categories: [],
  summary: [],
  hasVoted: false,
  loading: false,
  submitting: false,
  error: null,
};
