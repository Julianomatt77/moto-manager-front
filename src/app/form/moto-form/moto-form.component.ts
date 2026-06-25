import { Component, input, output, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { form, FormField, submit, required } from '@angular/forms/signals';
import { MotoService } from '../../services/moto/moto.service';

@Component({
  selector: 'app-moto-form',
  imports: [FormField],
  templateUrl: './moto-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MotoFormComponent {
  addOrEdit = input<'add' | 'edit'>('add');
  moto = input<any | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  private motoService = inject(MotoService);

  readonly model;
  readonly form;

  buttonLabel = '';
  editId = '';
  years: number[] = [];
  marqueErrorMessage = 'La marque est obligatoire.';
  modeleErrorMessage = 'Le modèle est obligatoire.';

  constructor() {
    const m = this.moto();
    this.model = signal({
      marque: m?.marque ?? '',
      modele: m?.modele ?? '',
      year: m?.year ?? 0,
    });

    this.form = form(this.model, (s) => {
      required(s.marque, { message: 'La marque est obligatoire.' });
      required(s.modele, { message: 'Le modèle est obligatoire.' });
    });
  }

  ngOnInit(): void {
    this.buttonLabel = this.addOrEdit() === 'edit' ? 'Mettre à jour' : 'Ajouter';

    const m = this.moto();
    if (this.addOrEdit() === 'edit' && m) {
      this.editId = m.id;
      this.model.set({
        marque: m.marque,
        modele: m.modele,
        year: m.year ?? 0,
      });
    }

    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      this.years.push(year);
    }
  }

  onSubmit() {
    submit(this.form, async () => {
      const data = { ...this.model(), year: this.model().year || null };
      if (this.addOrEdit() === 'add') {
        await this.motoService.save(data);
      } else {
        await this.motoService.patch(this.editId, data);
      }
      this.saved.emit();
    });
  }
}
