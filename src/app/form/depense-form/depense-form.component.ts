import { Component, input, output, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { form, FormField, submit, required, hidden } from '@angular/forms/signals';
import { DepensesService } from '../../services/depenses/depenses.service';
import { DepensesTypeService } from '../../services/depensesType/depenses-type.service';
import { MotoService } from '../../services/moto/moto.service';

@Component({
  selector: 'app-depense-form',
  imports: [FormField],
  templateUrl: './depense-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepenseFormComponent {
  addOrEdit = input<'add' | 'edit'>('add');
  depense = input<any | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  private depensesService = inject(DepensesService);
  private depensesTypeService = inject(DepensesTypeService);
  private motoService = inject(MotoService);

  readonly model;
  readonly form;

  buttonLabel = '';
  editId = '';
  montantErrorMessage = 'Le montant est obligatoire.';
  dateErrorMessage = 'La date est obligatoire.';
  depenseTypeErrorMessage = 'Le type de dépense est obligatoire.';
  motoErrorMessage = 'La moto est obligatoire.';

  depensesType = computed(() => {
    const types = this.depensesTypeService.depensesTypes.value();
    if (!types) return [];
    return [...types.map((t: any) => ({ id: t.id.toString(), name: t.name })), { id: '0', name: 'autre' }];
  });

  motoList = computed(() => {
    const data = this.motoService.motos.value();
    if (!data) return [];
    return data.map((m: any) => ({ id: m.id.toString(), name: m.modele }));
  });

  constructor() {
    const dep = this.depense();
    this.model = signal({
      montant: dep?.montant ?? 0,
      kmParcouru: dep?.kmParcouru ?? 0,
      essenceConsomme: dep?.essenceConsomme ?? 0,
      essencePrice: dep?.essencePrice ?? 0,
      commentaire: dep?.commentaire ?? '',
      kilometrage: dep?.kilometrage ?? 0,
      date: dep ? new Date(dep.date).toISOString().substring(0, 16) : '',
      depenseType: dep?.depenseType?.id?.toString() ?? dep?.depenseType?.toString() ?? '',
      autre_depense: '',
      moto: dep?.moto?.id?.toString() ?? dep?.moto?.toString() ?? '',
    });

    this.form = form(this.model, (s) => {
      required(s.montant, { message: 'Le montant est obligatoire.' });
      required(s.date, { message: 'La date est obligatoire.' });
      required(s.depenseType, { message: 'Le type de dépense est obligatoire.' });
      required(s.moto, { message: 'La moto est obligatoire.' });
      hidden(s.autre_depense, { when: ({ valueOf }) => valueOf(s.depenseType) !== '0' });
    });
  }

  ngOnInit(): void {
    this.buttonLabel = this.addOrEdit() === 'edit' ? 'Mettre à jour' : 'Ajouter';

    const dep = this.depense();
    if (this.addOrEdit() === 'edit' && dep) {
      this.editId = dep.id;
      this.model.set({
        montant: dep.montant,
        kmParcouru: dep.kmParcouru,
        essenceConsomme: dep.essenceConsomme,
        essencePrice: dep.essencePrice,
        commentaire: dep.commentaire,
        kilometrage: dep.kilometrage,
        date: new Date(dep.date).toISOString().substring(0, 16),
        depenseType: dep.depenseType?.id?.toString() ?? dep.depenseType?.toString() ?? '',
        autre_depense: '',
        moto: dep.moto?.id?.toString() ?? dep.moto?.toString() ?? '',
      });
    }
  }

  async onSubmit() {
    submit(this.form, async () => {
      const { autre_depense, ...data } = this.model();
      let finalData: any = { ...data };

      if (data.depenseType === '0' && autre_depense) {
        const newType = await this.depensesTypeService.save(autre_depense);
        finalData.depenseType = newType.id;
      }

      if (this.addOrEdit() === 'add') {
        await this.depensesService.save(finalData);
      } else {
        await this.depensesService.patch(this.editId, finalData);
      }
      this.saved.emit();
    });
  }
}
