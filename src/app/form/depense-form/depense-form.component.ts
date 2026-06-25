import { Component, input, output, inject, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DepensesService } from '../../services/depenses/depenses.service';
import { DepensesTypeService } from '../../services/depensesType/depenses-type.service';
import { MotoService } from '../../services/moto/moto.service';

@Component({
  selector: 'app-depense-form',
  imports: [ReactiveFormsModule],
  templateUrl: './depense-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepenseFormComponent implements OnInit, OnDestroy {
  addOrEdit = input<'add' | 'edit'>('add');
  depense = input<any | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  private fb = inject(FormBuilder);
  private depensesService = inject(DepensesService);
  private depensesTypeService = inject(DepensesTypeService);
  private motoService = inject(MotoService);

  private typeSub: Subscription | null = null;

  form = this.fb.group({
    montant: [null as number | null, [Validators.required]],
    kmParcouru: [null as number | null],
    essenceConsomme: [null as number | null],
    essencePrice: [null as number | null],
    commentaire: [''],
    kilometrage: [null as number | null],
    date: [null as string | null, [Validators.required]],
    depenseType: ['', [Validators.required]],
    autre_depense: [''],
    moto: ['', [Validators.required]]
  });

  buttonLabel = '';
  depensesType: { id: string; name: string }[] = [];
  motoList: { id: string; name: string }[] = [];
  selectedType = '';
  submitted = false;
  editId = '';
  autreDepenseError = '';
  montantErrorMessage = 'Le montant est obligatoire.';
  dateErrorMessage = 'La date est obligatoire.';
  depenseTypeErrorMessage = 'Le type de dépense est obligatoire.';
  motoErrorMessage = 'La moto est obligatoire.';

  ngOnInit(): void {
    this.buttonLabel = this.addOrEdit() === 'edit' ? 'Mettre à jour' : 'Ajouter';

    const dep = this.depense();
    if (this.addOrEdit() === 'edit' && dep) {
      this.editId = dep.id;
      const dateObject = new Date(dep.date);
      const formattedDate = dateObject.toISOString().substring(0, 16);

      this.form.patchValue({
        montant: dep.montant,
        kmParcouru: dep.kmParcouru,
        essenceConsomme: dep.essenceConsomme,
        essencePrice: dep.essencePrice,
        commentaire: dep.commentaire,
        kilometrage: dep.kilometrage,
        date: formattedDate,
        depenseType: dep.depenseType?.id?.toString() ?? dep.depenseType?.toString() ?? '',
        moto: dep.moto?.id?.toString() ?? dep.moto?.toString() ?? ''
      });
    }

    this.depensesTypeService.getDepensesTypes().subscribe((data: any[]) => {
      this.depensesType = data.map((t: any) => ({ id: t.id.toString(), name: t.name }));
      this.depensesType.push({ id: '0', name: 'autre' });
    });

    this.motoService.getMotos().subscribe((data: any[]) => {
      this.motoList = data.map((m: any) => ({ id: m.id.toString(), name: m.modele }));
    });

    this.typeSub = this.form.get('depenseType')?.valueChanges.subscribe(value => {
      this.selectedType = value as string;
      this.autreDepenseError = '';
      if (value !== '0') {
        this.form.get('autre_depense')?.setValue('');
      }
    }) ?? null;
  }

  ngOnDestroy(): void {
    this.typeSub?.unsubscribe();
  }

  onSubmitDepense(): void {
    this.submitted = true;
    this.autreDepenseError = '';

    if (this.form.get('depenseType')?.value === '0' && !this.form.get('autre_depense')?.value) {
      this.autreDepenseError = 'Le type de dépense est obligatoire.';
      return;
    }

    if (this.form.valid) {
      const formValue = this.form.value;
      const depenseData = { ...formValue };

      if (formValue.depenseType === '0' && formValue.autre_depense) {
        this.depensesTypeService.saveDepenseType(formValue.autre_depense).subscribe((newType: any) => {
          depenseData.depenseType = newType.id.toString();
          this.saveDepense(depenseData);
        });
      } else {
        this.saveDepense(depenseData);
      }
    }
  }

  private saveDepense(data: any): void {
    if (this.addOrEdit() === 'add') {
      this.depensesService.saveDepense(data).subscribe(() => this.saved.emit());
    } else {
      this.depensesService.patchDepense(this.editId, data).subscribe(() => this.saved.emit());
    }
  }
}
