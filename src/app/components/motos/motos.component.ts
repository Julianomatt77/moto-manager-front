import { Component, inject, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { MotoService } from '../../services/moto/moto.service';
import { DepensesService } from '../../services/depenses/depenses.service';
import { EntretiensService } from '../../services/entretiens/entretiens.service';
import { StorageService } from '../../services/storage/storage.service';
import { DialogComponent } from '../../shared/dialog.component';
import { IconComponent } from '../../shared/icon.component';
import { MotoFormComponent } from '../../form/moto-form/moto-form.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-motos',
  imports: [DialogComponent, IconComponent, MotoFormComponent, ConfirmationDialogComponent],
  templateUrl: './motos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MotosComponent {
  private motosService = inject(MotoService);
  private depensesService = inject(DepensesService);
  private entretiensService = inject(EntretiensService);
  private storageService = inject(StorageService);

  user = this.storageService.getUser();

  isLoading = computed(() =>
    this.motosService.motos.isLoading() ||
    this.depensesService.depenses.isLoading() ||
    this.entretiensService.entretiens.isLoading()
  );

  error = computed(() => {
    return this.motosService.motos.error()?.message
      || this.depensesService.depenses.error()?.message
      || this.entretiensService.entretiens.error()?.message
      || null;
  });

  motos = computed(() => {
    const motosData = this.motosService.motos.value();
    const depensesData = this.depensesService.depenses.value();
    const entretiensData = this.entretiensService.entretiens.value();
    if (!motosData || !depensesData || !entretiensData) return [];
    return this.computeMotoStats(motosData, depensesData, entretiensData);
  });

  deactivatedMotos = computed(() => this.motosService.deactivatedMotos.value() ?? []);

  showFormDialog = signal(false);
  showConfirmDialog = signal(false);
  confirmMessage = signal('');
  selectedMoto = signal<any | null>(null);
  addOrEdit = signal<'add' | 'edit'>('add');

  private computeMotoStats(motos: any[], depenses: any[], entretiens: any[]): any[] {
    const aujourdHui = new Date();

    return motos.map((moto) => {
      const motoDepenses = depenses.filter((d) => d.moto?.id === moto.id);
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

      const motoEntretiens = entretiens.filter((e) => e.moto?.id === moto.id);

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

  async onDeleteConfirmed(): Promise<void> {
    const moto = this.selectedMoto();
    if (!moto) return;
    await this.motosService.delete(moto.id);
    this.showConfirmDialog.set(false);
    this.selectedMoto.set(null);
  }

  onDeleteCancelled(): void {
    this.showConfirmDialog.set(false);
    this.selectedMoto.set(null);
  }

  async reactivateMoto(moto: any): Promise<void> {
    await this.motosService.reactivate(moto.id);
  }
}
