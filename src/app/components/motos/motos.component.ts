import {Component, inject, ChangeDetectionStrategy, OnInit, signal} from '@angular/core';
import {forkJoin} from 'rxjs';
import {MotoService} from '../../services/moto/moto.service';
import {DepensesService} from '../../services/depenses/depenses.service';
import {EntretiensService} from '../../services/entretiens/entretiens.service';
import {StorageService} from '../../services/storage/storage.service';
import {DialogComponent} from '../../shared/dialog.component';
import {IconComponent} from '../../shared/icon.component';
import {MotoFormComponent} from '../../form/moto-form/moto-form.component';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-motos',
  imports: [DialogComponent, IconComponent, MotoFormComponent, ConfirmationDialogComponent],
  templateUrl: './motos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MotosComponent implements OnInit {
  private motosService = inject(MotoService);
  private depensesService = inject(DepensesService);
  private entretiensService = inject(EntretiensService);
  private storageService = inject(StorageService);

  user = this.storageService.getUser();
  motos = signal<any[]>([]);
  deactivatedMotos = signal<any[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  showFormDialog = signal(false);
  showConfirmDialog = signal(false);
  confirmMessage = signal('');
  selectedMoto = signal<any | null>(null);
  addOrEdit = signal<'add' | 'edit'>('add');

  ngOnInit(): void {
    this.loadMotosData();
  }

  loadMotosData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    forkJoin({
      motos: this.motosService.getAllMotos(),
      deactivated: this.motosService.getDeactivatedMotos(),
      depenses: this.depensesService.getDepenses(),
      entretiens: this.entretiensService.getEntretiens(),
    }).subscribe({
      next: (data) => {
        this.motos.set(this.computeMotoStats(data.motos, data.depenses, data.entretiens));
        this.deactivatedMotos.set(data.deactivated);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Une erreur est survenue');
        this.isLoading.set(false);
      },
    });
  }

  private computeMotoStats(motos: any[], depenses: any[], entretiens: any[]): any[] {
    const aujourdHui = new Date();

    return motos.map((moto) => {
      const motoDepenses = depenses.filter((d) => d.moto.id === moto.id);
      let montantTotal = 0;
      const km: number[] = [];
      const consos: number[] = [];
      let litresTotal = 0;

      for (const d of motoDepenses) {
        montantTotal += d.montant;
        km.push(d.kilometrage);
        if (d.consoMoyenne) consos.push(d.consoMoyenne);
        if (d.essenceConsomme) litresTotal += Math.round(d.essenceConsomme);
      }

      const minKm = km.length > 0 ? Math.min(...km) : 0;
      const maxKm = km.length > 0 ? Math.max(...km) : 0;
      const kmParcouru = maxKm - minKm;
      const prk = kmParcouru > 0 ? Number((montantTotal / kmParcouru).toFixed(2)) : 0;
      const consoMoyenne =
        consos.length > 0
          ? Number((consos.reduce((a, v) => a + v, 0) / consos.length).toFixed(2))
          : 0;

      const motoEntretiens = entretiens.filter((e) => e.moto.id === moto.id);

      const diffDays = (dateStr: string) =>
        Math.floor((aujourdHui.getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));

      const graissageDates = motoEntretiens
        .filter((e) => e.graissage)
        .map((e) => diffDays(e.date));
      const pressionDates = motoEntretiens
        .filter((e) => e.pressionAv > 0)
        .map((e) => diffDays(e.date));

      return {
        ...moto,
        litresTotal,
        consoMoyenne,
        prk,
        dateLastGraissage: graissageDates.length > 0 ? Math.min(...graissageDates) : null,
        dateLastPression: pressionDates.length > 0 ? Math.min(...pressionDates) : null,
      };
    });
  }

  addMoto(): void {
    this.selectedMoto.set(null);
    this.addOrEdit.set('add');
    this.showFormDialog.set(true);
  }

  editMoto(moto: any): void {
    this.selectedMoto.set(moto);
    this.addOrEdit.set('edit');
    this.showFormDialog.set(true);
  }

  onFormSaved(): void {
    this.showFormDialog.set(false);
    this.loadMotosData();
  }

  onFormCancelled(): void {
    this.showFormDialog.set(false);
  }

  openConfirmation(moto: any): void {
    this.selectedMoto.set(moto);
    this.confirmMessage.set(
      `Êtes-vous sûr de vouloir supprimer cette moto (${moto.marque} ${moto.modele})?`
    );
    this.showConfirmDialog.set(true);
  }

  onDeleteConfirmed(): void {
    const moto = this.selectedMoto();
    if (!moto) return;
    this.motosService.deleteMoto(moto.id).subscribe(() => {
      this.showConfirmDialog.set(false);
      this.selectedMoto.set(null);
      this.loadMotosData();
    });
  }

  onDeleteCancelled(): void {
    this.showConfirmDialog.set(false);
    this.selectedMoto.set(null);
  }

  reactivateMoto(moto: any): void {
    this.motosService.reactivateMoto(moto.id).subscribe(() => {
      this.loadMotosData();
    });
  }
}
