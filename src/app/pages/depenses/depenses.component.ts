import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DepensesService } from '../../services/depenses/depenses.service';
import { StorageService } from '../../services/storage/storage.service';
import { ExportService } from '../../services/export/export.service';
import { MotoService } from '../../services/moto/moto.service';
import { DepensesTypeService } from '../../services/depensesType/depenses-type.service';
import { DialogComponent } from '../../shared/dialog.component';
import { IconComponent } from '../../shared/icon.component';
import { PaginatorComponent } from '../../shared/paginator.component';
import { DepenseFormComponent } from '../../form/depense-form/depense-form.component';
import { UploadPopupComponent } from '../../form/upload-popup/upload-popup.component';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-depenses',
  imports: [DatePipe, DecimalPipe, DialogComponent, IconComponent, PaginatorComponent, DepenseFormComponent, UploadPopupComponent, ConfirmationDialogComponent],
  templateUrl: './depenses.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepensesComponent {
  private depensesService = inject(DepensesService);
  private motoService = inject(MotoService);
  private depensesTypesService = inject(DepensesTypeService);
  private storageService = inject(StorageService);
  private exportService = inject(ExportService);

  user = this.storageService.getUser();

  isLoading = computed(() => this.depensesService.depenses.isLoading());
  error = computed(() => this.depensesService.depenses.error()?.message || null);

  depenses = computed(() => this.depensesService.depenses.value() ?? []);
  motos = computed(() => this.motoService.motos.value() ?? []);
  depensesTypes = computed(() => {
    const types = this.depensesTypesService.depensesTypes.value();
    if (!types) return [];
    return [...types].sort((a: any, b: any) => a.name.localeCompare(b.name));
  });

  availableYears = signal<number[]>(this.generateYears());

  motoFilter = signal('');
  yearFilter = signal(0);
  typeFilter = signal('');

  currentPage = signal(0);
  pageSize = signal(10);

  showFormDialog = signal(false);
  formMode = signal<'add' | 'edit'>('add');
  formDepense = signal<any | null>(null);
  showUploadDialog = signal(false);
  showConfirmDialog = signal(false);
  confirmMessage = signal('');
  itemToDelete = signal<any | null>(null);

  filteredDepenses = computed(() => {
    let result = this.depenses();
    const moto = this.motoFilter();
    const year = this.yearFilter();
    const type = this.typeFilter();

    if (moto) {
      result = result.filter(d => d.moto?.id == moto);
    }
    if (year) {
      result = result.filter(d => new Date(d.date).getFullYear() === year);
    }
    if (type) {
      result = result.filter(d => d.depenseType?.id == type);
    }
    return result;
  });

  totalLength = computed(() => this.filteredDepenses().length);

  paginatedDepenses = computed(() => {
    const start = this.currentPage() * this.pageSize();
    return this.filteredDepenses().slice(start, start + this.pageSize());
  });

  depensesTotal = computed(() =>
    this.filteredDepenses().reduce((sum, d) => sum + (d.montant || 0), 0)
  );

  private generateYears(): number[] {
    const current = new Date().getFullYear();
    const years: number[] = [];
    for (let i = current; i >= 2000; i--) {
      years.push(i);
    }
    return years;
  }

  addDepense(): void {
    this.formMode.set('add');
    this.formDepense.set(null);
    this.showFormDialog.set(true);
  }

  editDepense(depense: any): void {
    this.formMode.set('edit');
    this.formDepense.set(depense);
    this.showFormDialog.set(true);
  }

  closeForm(): void {
    this.showFormDialog.set(false);
  }

  onFormSaved(): void {
    this.showFormDialog.set(false);
  }

  openConfirmation(depense: any): void {
    this.itemToDelete.set(depense);
    this.confirmMessage.set('Etes vous sûr de vouloir supprimer cette opération ?');
    this.showConfirmDialog.set(true);
  }

  async onConfirmDelete(): Promise<void> {
    const item = this.itemToDelete();
    if (item) {
      await this.depensesService.delete(item.id);
      this.showConfirmDialog.set(false);
      this.itemToDelete.set(null);
    }
  }

  openUploadDialog(): void {
    this.showUploadDialog.set(true);
  }

  onUploadSaved(): void {
    this.showUploadDialog.set(false);
  }

  async export(): Promise<void> {
    const blob = await this.exportService.exportDepenses();
    this.exportService.downloadBlob(blob, 'depenses');
  }

  onChangePage(index: number): void {
    this.currentPage.set(index);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(0);
  }

  resetAllFilters(): void {
    this.motoFilter.set('');
    this.yearFilter.set(0);
    this.typeFilter.set('');
    this.currentPage.set(0);
  }
}
