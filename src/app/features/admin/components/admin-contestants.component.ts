import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectAdminState } from '../../../store/admin/admin.selectors';
import { createContestant, updateContestant, deleteContestant } from '../../../store/admin/admin.actions';

@Component({
  selector: 'app-admin-contestants',
  templateUrl: './admin-contestants.component.html',
  styleUrls: ['./admin-contestants.component.scss'],
})
export class AdminContestantsComponent {
  admin$ = this.store.select(selectAdminState);
  editingId: string | null = null;
  creating = false;
  draft: any = {};

  constructor(private store: Store<AppState>) {}

  startCreate() { this.creating = true; this.editingId = null; this.draft = { stageName: '', style: '', notes: '' }; }
  startEdit(c: any) { this.creating = false; this.editingId = c.id; this.draft = { ...c }; }
  cancelEdit() { this.editingId = null; this.creating = false; this.draft = {}; }

  save() {
    if (this.creating) this.store.dispatch(createContestant({ data: this.draft }));
    else this.store.dispatch(updateContestant({ contestantId: this.editingId!, data: this.draft }));
    this.cancelEdit();
  }

  del(id: string) { if (confirm('Delete this contestant?')) this.store.dispatch(deleteContestant({ contestantId: id })); }
  trackById(_: number, item: any) { return item.id; }
}
