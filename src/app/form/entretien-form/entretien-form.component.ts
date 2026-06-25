import { Component, input, output, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { form, FormField, submit, required } from '@angular/forms/signals';
import { EntretiensService } from '../../services/entretiens/entretiens.service';
import { MotoService } from '../../services/moto/moto.service';
import { ToggleComponent } from '../../shared/toggle.component';

@Component({
  selector: 'app-entretien-form',
  imports: [FormField, ToggleComponent],
  templateUrl: './entretien-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntretienFormComponent {
  addOrEdit = input<'add' | 'edit'>('add');
  entretien = input<any | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  private entretiensService = inject(EntretiensService);
  private motoService = inject(MotoService);

  readonly model;
  readonly form;

  buttonLabel = '';
  editId = '';
  dateErrorMessage = 'La date est obligatoire.';
  motoErrorMessage = 'La moto est obligatoire.';

  motoList = computed(() => {
    const data = this.motoService.motos.value();
    if (!data) return [];
    return data.map((m: any) => ({ id: m.id.toString(), name: m.modele }));
  });

  constructor() {
    const ent = this.entretien();
    this.model = signal({
      graissage: ent?.graissage ?? false,
      lavage: ent?.lavage ?? false,
      pressionAv: ent?.pressionAv ?? 0,
      pressionAr: ent?.pressionAr ?? 0,
      kilometrage: ent?.kilometrage ?? 0,
      date: ent ? new Date(ent.date).toISOString().substring(0, 16) : '',
      moto: ent?.moto?.id?.toString() ?? ent?.moto?.toString() ?? '',
    });

    this.form = form(this.model, (s) => {
      required(s.date, { message: 'La date est obligatoire.' });
      required(s.moto, { message: 'La moto est obligatoire.' });
    });
  }

  ngOnInit(): void {
    this.buttonLabel = this.addOrEdit() === 'edit' ? 'Mettre à jour' : 'Ajouter';

    const ent = this.entretien();
    if (this.addOrEdit() === 'edit' && ent) {
      this.editId = ent.id;
      this.model.set({
        graissage: ent.graissage ?? false,
        lavage: ent.lavage ?? false,
        pressionAv: ent.pressionAv,
        pressionAr: ent.pressionAr,
        kilometrage: ent.kilometrage,
        date: new Date(ent.date).toISOString().substring(0, 16),
        moto: ent.moto?.id?.toString() ?? ent.moto?.toString() ?? '',
      });
    }
  }

  onSubmit() {
    submit(this.form, async () => {
      if (this.addOrEdit() === 'add') {
        await this.entretiensService.save(this.model());
      } else {
        await this.entretiensService.patch(this.editId, this.model());
      }
      this.saved.emit();
    });
  }
}
