import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectAdminState } from '../../../store/admin/admin.selectors';
import { deleteScore, resetEventScores, exportCsv } from '../../../store/admin/admin.actions';

@Component({
  selector: 'app-admin-scores',
  templateUrl: './admin-scores.component.html',
  styleUrls: ['./admin-scores.component.scss'],
})
export class AdminScoresComponent {
  admin$ = this.store.select(selectAdminState);
  selectedEventId: string | null = null;

  constructor(private store: Store<AppState>) {}

  selectEvent(id: string) { this.selectedEventId = id; }

  delScore(scoreId: string) {
    if (confirm('Delete this score entry?')) this.store.dispatch(deleteScore({ scoreId }));
  }

  resetScores(eventId: string) {
    if (confirm('Reset ALL scores for this event? This cannot be undone.')) {
      this.store.dispatch(resetEventScores({ eventId }));
    }
  }

  export(eventId: string) { this.store.dispatch(exportCsv({ eventId })); }
  trackById(_: number, item: any) { return item.id; }
}
