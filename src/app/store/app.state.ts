import { JudgeState } from './judge/judge.state';
import { AudienceState } from './audience/audience.state';
import { AdminState } from './admin/admin.state';

export interface AppState {
  judge: JudgeState;
  audience: AudienceState;
  admin: AdminState;
}
