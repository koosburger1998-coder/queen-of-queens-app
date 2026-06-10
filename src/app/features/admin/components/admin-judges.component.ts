import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectAdminState } from '../../../store/admin/admin.selectors';
import { createJudge, updateJudge, deleteJudge } from '../../../store/admin/admin.actions';

@Component({
  selector: 'app-admin-judges',
  templateUrl: './admin-judges.component.html',
  styleUrls: ['./admin-judges.component.scss'],
})
export class AdminJudgesComponent {
  admin$ = this.store.select(selectAdminState);
  editingId: string | null = null;
  creating = false;
  draft: any = {};
  showCodes: Record<string, boolean> = {};

  constructor(private store: Store<AppState>) {}

  startCreate() { this.creating = true; this.editingId = null; this.draft = { name: '', code: '' }; }
  startEdit(j: any) { this.creating = false; this.editingId = j.id; this.draft = { name: j.name, code: j.code }; }
  cancelEdit() { this.editingId = null; this.creating = false; this.draft = {}; }

  save() {
    if (this.creating) this.store.dispatch(createJudge({ data: this.draft }));
    else this.store.dispatch(updateJudge({ judgeId: this.editingId!, data: this.draft }));
    this.cancelEdit();
  }

  del(id: string) { if (confirm('Delete this judge?')) this.store.dispatch(deleteJudge({ judgeId: id })); }
  toggleCode(id: string) { this.showCodes[id] = !this.showCodes[id]; }
  trackById(_: number, item: any) { return item.id; }
}
