export interface JudgeEvent {
  id: string;
  name: string;
  date: string;
  venue: string;
  scoringLocked: boolean;
  roundKey?: string;
  stage?: string;
}

export interface JudgeContestant {
  id: string;
  stageName: string;
  style: string;
  notes: string;
  order: number;
}

export interface JudgeCategory {
  id: string;
  name: string;
  order: number;
}

export interface JudgeScore {
  id: string;
  contestantId: string;
  values: Record<string, number>;
  comment: string;
  updatedAt: string;
}

export interface JudgeState {
  event: JudgeEvent | null;
  categories: JudgeCategory[];
  contestants: JudgeContestant[];
  myScores: JudgeScore[];
  canJudge: boolean;
  currentIndex: number;
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

export const initialJudgeState: JudgeState = {
  event: null,
  categories: [],
  contestants: [],
  myScores: [],
  canJudge: false,
  currentIndex: 0,
  loading: false,
  submitting: false,
  error: null,
};
