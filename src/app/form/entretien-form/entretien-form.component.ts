import { Component, input, output, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EntretiensService } from '../../services/entretiens/entretiens.service';
import { MotoService } from '../../services/moto/moto.service';
import { ToggleComponent } from '../../shared/toggle.component';

@Component({
  selector: 'app-entretien-form',
  imports: [ReactiveFormsModule, ToggleComponent],
  templateUrl: './entretien-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntretienFormComponent implements OnInit {
  addOrEdit = input<'add' | 'edit'>('add');
  entretien = input<any | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  private fb = inject(FormBuilder);
  private entretiensService = inject(EntretiensService);
  private motoService = inject(MotoService);

  form = this.fb.group({
    graissage: [false],
    lavage: [false],
    pressionAv: [null as number | null],
    pressionAr: [null as number | null],
    kilometrage: [null as number | null],
    date: [null as string | null, [Validators.required]],
    moto: ['', [Validators.required]]
  });

  buttonLabel = '';
  motoList: { id: string; name: string }[] = [];
  submitted = false;
  editId = '';
  dateErrorMessage = 'La date est obligatoire.';
  motoErrorMessage = 'La moto est obligatoire.';

  ngOnInit(): void {
    this.buttonLabel = this.addOrEdit() === 'edit' ? 'Mettre à jour' : 'Ajouter';

    const ent = this.entretien();
    if (this.addOrEdit() === 'edit' && ent) {
      this.editId = ent.id;
      const dateObject = new Date(ent.date);
      const formattedDate = dateObject.toISOString().substring(0, 16);

      this.form.patchValue({
        graissage: ent.graissage ?? false,
        lavage: ent.lavage ?? false,
        pressionAv: ent.pressionAv,
        pressionAr: ent.pressionAr,
        kilometrage: ent.kilometrage,
        date: formattedDate,
        moto: ent.moto?.id?.toString() ?? ent.moto?.toString() ?? ''
      });
    }

    this.motoService.getMotos().subscribe((data: any[]) => {
      this.motoList = data.map((m: any) => ({ id: m.id.toString(), name: m.modele }));
    });
  }

  onSubmitEntretien(): void {
    this.submitted = true;
    if (this.form.valid) {
      const formValue = this.form.value;
      this.saveEntretien(formValue);
    }
  }

  private saveEntretien(data: any): void {
    if (this.addOrEdit() === 'add') {
      this.entretiensService.saveEntretien(data).subscribe(() => this.saved.emit());
    } else {
      this.entretiensService.patchEntretien(this.editId, data).subscribe(() => this.saved.emit());
    }
  }

  onGraissageChange(value: boolean): void {
    this.form.patchValue({ graissage: value });
  }

  onLavageChange(value: boolean): void {
    this.form.patchValue({ lavage: value });
  }
}
