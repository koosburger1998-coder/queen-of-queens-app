import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectAdminState } from '../../../store/admin/admin.selectors';
import {
  activateEvent, createEvent, updateEvent, deleteEvent,
  lockScoring, unlockScoring, lockGuestVoting, unlockGuestVoting,
  addJudgeToEvent, removeJudgeFromEvent,
  addContestantToEvent, removeContestantFromEvent,
} from '../../../store/admin/admin.actions';

@Component({
  selector: 'app-admin-events',
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.scss'],
})
export class AdminEventsComponent {
  admin$ = this.store.select(selectAdminState);
  editingId: string | null = null;
  creating = false;
  draft: any = {};
  showAssign: Record<string, boolean> = {};

  constructor(private store: Store<AppState>) {}

  startCreate() {
    this.creating = true;
    this.editingId = null;
    this.draft = { name: '', date: '', venue: '', description: '', expectedContestants: 4, songCount: 3, advanceCount: 2 };
  }

  startEdit(event: any) {
    this.creating = false;
    this.editingId = event.id;
    this.draft = { ...event };
  }

  cancelEdit() { this.editingId = null; this.creating = false; this.draft = {}; }

  save() {
    if (this.creating) {
      this.store.dispatch(createEvent({ data: this.draft }));
    } else {
      this.store.dispatch(updateEvent({ eventId: this.editingId!, data: this.draft }));
    }
    this.cancelEdit();
  }

  activate(eventId: string) { this.store.dispatch(activateEvent({ eventId })); }
  del(eventId: string) { if (confirm('Delete this event?')) this.store.dispatch(deleteEvent({ eventId })); }

  lockScores(eventId: string, locked: boolean) {
    this.store.dispatch(locked ? unlockScoring({ eventId }) : lockScoring({ eventId }));
  }
  lockVoting(eventId: string, locked: boolean) {
    this.store.dispatch(locked ? unlockGuestVoting({ eventId }) : lockGuestVoting({ eventId }));
  }

  toggleAssign(eventId: string) { this.showAssign[eventId] = !this.showAssign[eventId]; }

  isAssigned(ids: string[], id: string) { return ids?.includes(id); }

  addJudge(eventId: string, judgeId: string) { this.store.dispatch(addJudgeToEvent({ eventId, judgeId })); }
  removeJudge(eventId: string, judgeId: string) { this.store.dispatch(removeJudgeFromEvent({ eventId, judgeId })); }
  addContestant(eventId: string, contestantId: string) { this.store.dispatch(addContestantToEvent({ eventId, contestantId })); }
  removeContestant(eventId: string, contestantId: string) { this.store.dispatch(removeContestantFromEvent({ eventId, contestantId })); }

  trackById(_: number, item: any) { return item.id; }
}
