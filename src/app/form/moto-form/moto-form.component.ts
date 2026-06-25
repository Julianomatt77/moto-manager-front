import { Component, input, output, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MotoService } from '../../services/moto/moto.service';

@Component({
  selector: 'app-moto-form',
  imports: [ReactiveFormsModule],
  templateUrl: './moto-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MotoFormComponent implements OnInit {
  addOrEdit = input<'add' | 'edit'>('add');
  moto = input<any | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  private fb = inject(FormBuilder);
  private motoService = inject(MotoService);

  form = this.fb.group({
    marque: [null as string | null, [Validators.required]],
    modele: [null as string | null, [Validators.required]],
    year: [null as number | null]
  });

  buttonLabel = '';
  submitted = false;
  editId = '';
  years: number[] = [];
  marqueErrorMessage = 'La marque est obligatoire.';
  modeleErrorMessage = 'Le modèle est obligatoire.';

  ngOnInit(): void {
    this.buttonLabel = this.addOrEdit() === 'edit' ? 'Mettre à jour' : 'Ajouter';

    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      this.years.push(year);
    }

    const m = this.moto();
    if (this.addOrEdit() === 'edit' && m) {
      this.editId = m.id;
      this.form.patchValue({
        marque: m.marque,
        modele: m.modele,
        year: m.year
      });
    }
  }

  onSubmitMoto(): void {
    this.submitted = true;
    if (this.form.valid) {
      const formValue = this.form.value;
      const motoData = {
        ...formValue,
        year: formValue.year != null ? +formValue.year : null
      };
      this.saveMoto(motoData);
    }
  }

  private saveMoto(data: any): void {
    if (this.addOrEdit() === 'add') {
      this.motoService.saveMoto(data).subscribe(() => this.saved.emit());
    } else {
      this.motoService.patchMoto(this.editId, data).subscribe(() => this.saved.emit());
    }
  }
}
