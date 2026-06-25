import {Component, inject, OnInit, ChangeDetectionStrategy, signal, computed} from '@angular/core';
import {DatePipe} from '@angular/common';
import {EntretiensService} from '../../services/entretiens/entretiens.service';
import {StorageService} from '../../services/storage/storage.service';
import {ExportService} from '../../services/export/export.service';
import {DialogComponent} from '../../shared/dialog.component';
import {IconComponent} from '../../shared/icon.component';
import {PaginatorComponent} from '../../shared/paginator.component';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {EntretienFormComponent} from '../../form/entretien-form/entretien-form.component';
import {UploadPopupComponent} from '../../form/upload-popup/upload-popup.component';

@Component({
  selector: 'app-entretien',
  imports: [
    DatePipe,
    DialogComponent,
    IconComponent,
    PaginatorComponent,
    ConfirmationDialogComponent,
    EntretienFormComponent,
    UploadPopupComponent,
  ],
  templateUrl: './entretien.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntretienComponent implements OnInit {
  private entretiensService = inject(EntretiensService);
  private storageService = inject(StorageService);
  private exportService = inject(ExportService);

  entretiens = signal<any[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  currentPage = signal(0);
  pageSize = signal(10);

  formDialogOpen = signal(false);
  formMode = signal<'add' | 'edit'>('add');
  editTarget = signal<any | null>(null);

  confirmationDialogOpen = signal(false);
  deleteTarget = signal<any | null>(null);

  uploadDialogOpen = signal(false);

  paginatedEntretiens = computed(() => {
    const start = this.currentPage() * this.pageSize();
    return this.entretiens().slice(start, start + this.pageSize());
  });

  user = this.storageService.getUser();

  ngOnInit(): void {
    this.loadEntretiens();
  }

  loadEntretiens(): void {
    this.isLoading.set(true);
    this.entretiensService.getEntretiens().subscribe({
      next: (data) => {
        this.entretiens.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Erreur lors du chargement');
        this.isLoading.set(false);
      },
    });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  openAddDialog(): void {
    this.formMode.set('add');
    this.editTarget.set(null);
    this.formDialogOpen.set(true);
  }

  openEditDialog(entretien: any): void {
    this.formMode.set('edit');
    this.editTarget.set(entretien);
    this.formDialogOpen.set(true);
  }

  onFormSaved(): void {
    this.formDialogOpen.set(false);
    this.loadEntretiens();
  }

  onFormCancelled(): void {
    this.formDialogOpen.set(false);
  }

  openDeleteConfirmation(entretien: any): void {
    this.deleteTarget.set(entretien);
    this.confirmationDialogOpen.set(true);
  }

  onDeleteConfirmed(): void {
    const target = this.deleteTarget();
    if (!target) return;
    this.entretiensService.deleteEntretien(target.id).subscribe(() => {
      this.confirmationDialogOpen.set(false);
      this.deleteTarget.set(null);
      this.loadEntretiens();
    });
  }

  onDeleteCancelled(): void {
    this.confirmationDialogOpen.set(false);
    this.deleteTarget.set(null);
  }

  openUploadDialog(): void {
    this.uploadDialogOpen.set(true);
  }

  onUploadSaved(): void {
    this.uploadDialogOpen.set(false);
    this.loadEntretiens();
  }

  onUploadCancelled(): void {
    this.uploadDialogOpen.set(false);
  }

  exportCsv(): void {
    this.exportService.exportEntretiens().subscribe((response) => {
      this.exportService.handleCsvDownload(response, 'entretiens');
    });
  }
}
