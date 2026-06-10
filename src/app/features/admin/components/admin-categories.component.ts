import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectAdminState } from '../../../store/admin/admin.selectors';
import {
  createCategory, updateCategory, deleteCategory,
  createGuestCategory, updateGuestCategory, deleteGuestCategory,
} from '../../../store/admin/admin.actions';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.scss'],
})
export class AdminCategoriesComponent {
  admin$ = this.store.select(selectAdminState);
  editingId: string | null = null;
  editingType: 'judge' | 'guest' | null = null;
  creating = false;
  creatingType: 'judge' | 'guest' | null = null;
  draft: any = {};

  constructor(private store: Store<AppState>) {}

  startCreate(type: 'judge' | 'guest') {
    this.creating = true; this.creatingType = type;
    this.editingId = null; this.editingType = null;
    this.draft = { name: '', order: 0 };
  }

  startEdit(cat: any, type: 'judge' | 'guest') {
    this.creating = false; this.creatingType = null;
    this.editingId = cat.id; this.editingType = type;
    this.draft = { name: cat.name, order: cat.order };
  }

  cancelEdit() { this.editingId = null; this.editingType = null; this.creating = false; this.creatingType = null; this.draft = {}; }

  save() {
    const type = this.creating ? this.creatingType! : this.editingType!;
    if (this.creating) {
      if (type === 'judge') this.store.dispatch(createCategory({ data: this.draft }));
      else this.store.dispatch(createGuestCategory({ data: this.draft }));
    } else {
      if (type === 'judge') this.store.dispatch(updateCategory({ categoryId: this.editingId!, data: this.draft }));
      else this.store.dispatch(updateGuestCategory({ categoryId: this.editingId!, data: this.draft }));
    }
    this.cancelEdit();
  }

  del(id: string, type: 'judge' | 'guest') {
    if (!confirm('Delete this category?')) return;
    if (type === 'judge') this.store.dispatch(deleteCategory({ categoryId: id }));
    else this.store.dispatch(deleteGuestCategory({ categoryId: id }));
  }

  trackById(_: number, item: any) { return item.id; }
}
