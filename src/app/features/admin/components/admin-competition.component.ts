import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectAdminState } from '../../../store/admin/admin.selectors';
import {
  updateCompetition, setupRounds, populateNextRound,
  setEventWinners,
} from '../../../store/admin/admin.actions';

@Component({
  selector: 'app-admin-competition',
  templateUrl: './admin-competition.component.html',
  styleUrls: ['./admin-competition.component.scss'],
})
export class AdminCompetitionComponent {
  admin$ = this.store.select(selectAdminState);
  editingConfig = false;
  configDraft: any = {};
  selectedWinners: Record<string, string[]> = {};

  constructor(private store: Store<AppState>) {}

  startEditConfig(comp: any) {
    this.editingConfig = true;
    this.configDraft = { ...comp };
  }

  saveConfig() {
    this.store.dispatch(updateCompetition({ data: this.configDraft }));
    this.editingConfig = false;
  }

  setupAll() {
    if (confirm('This will create all competition events. Continue?')) {
      this.store.dispatch(setupRounds());
    }
  }

  populate(roundKey: string) {
    this.store.dispatch(populateNextRound({ roundKey }));
  }

  toggleWinner(eventId: string, contestantId: string, type: 'winner' | 'wildcard') {
    const key = `${eventId}:${type}`;
    const current = this.selectedWinners[key] || [];
    this.selectedWinners = {
      ...this.selectedWinners,
      [key]: current.includes(contestantId)
        ? current.filter((id) => id !== contestantId)
        : [...current, contestantId],
    };
  }

  saveWinners(eventId: string) {
    const winners = this.selectedWinners[`${eventId}:winner`] || [];
    const wildcards = this.selectedWinners[`${eventId}:wildcard`] || [];
    this.store.dispatch(setEventWinners({ eventId, winners, wildcards }));
  }

  isSelected(eventId: string, contestantId: string, type: 'winner' | 'wildcard'): boolean {
    return (this.selectedWinners[`${eventId}:${type}`] || []).includes(contestantId);
  }

  trackById(_: number, item: any) { return item.id; }
  trackByKey(_: number, item: any) { return item.roundKey || item.id; }
}
