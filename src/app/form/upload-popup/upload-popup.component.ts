import { Component, input, output, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { read, utils } from 'xlsx';
import { form, FormField, submit, required } from '@angular/forms/signals';
import { DepensesService } from '../../services/depenses/depenses.service';
import { DepensesTypeService } from '../../services/depensesType/depenses-type.service';
import { MotoService } from '../../services/moto/moto.service';
import { EntretiensService } from '../../services/entretiens/entretiens.service';
import { IconComponent } from '../../shared/icon.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-upload-popup',
  imports: [FormField, IconComponent],
  templateUrl: './upload-popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadPopupComponent {
  type = input<'depense' | 'entretien'>('depense');
  saved = output<void>();
  cancelled = output<void>();

  private http = inject(HttpClient);
  private depensesService = inject(DepensesService);
  private entretiensService = inject(EntretiensService);
  private depensesTypeService = inject(DepensesTypeService);
  private motoService = inject(MotoService);

  readonly model = signal({ moto: '' });
  readonly form = form(this.model, (s) => {
    required(s.moto, { message: 'La moto est obligatoire.' });
  });

  fileName = '';
  uploadData: any[] = [];
  selectedType = '';
  submitted = false;
  depenseList: any[] = [];
  entretienList: any[] = [];
  isLoading = false;
  fileImported = signal(false);
  fileErrorMessage = '';
  uploadErrors = signal<string[]>([]);
  templateName = '';
  progress = signal(0);

  depensesType = computed(() => {
    const data = this.depensesTypeService.depensesTypes.value();
    if (!data) return [];
    return [...data.map((t: any) => ({ id: t.id, name: t.name })), { id: 0, name: 'autre' }];
  });

  motoList = computed(() => {
    const data = this.motoService.motos.value();
    if (!data) return [];
    return data.map((m: any) => ({ id: m.id.toString(), name: m.modele }));
  });

  ngOnInit(): void {
    if (this.type() === 'depense') {
      this.templateName = 'depense-moto-template.xlsx';
    } else {
      this.templateName = 'entretien-moto-template.xlsx';
    }
  }

  onFileSelected(event: any): void {
    this.isLoading = true;
    this.fileErrorMessage = '';
    this.progress.set(0);
    this.uploadErrors.set([]);
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = async (event: any) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          this.uploadData = rows;
        }

        const error = this.checkFileDataFormat(this.uploadData);

        if (!error) {
          if (this.type() === 'depense') {
            await this.transformDepenseType(this.uploadData);
            this.transformDataToDepense(this.uploadData);
          } else {
            this.transformDataToEntretien(this.uploadData);
          }
          this.fileImported.set(true);
          this.isLoading = false;
        } else {
          this.fileErrorMessage = error;
          this.isLoading = false;
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      this.isLoading = false;
    }
  }

  async onSubmitUpload(): Promise<void> {
    this.submitted = true;
    if (this.form().invalid() || this.fileErrorMessage) return;

    this.isLoading = true;
    this.progress.set(0);
    this.uploadErrors.set([]);

    const motoId = this.model().moto;
    const items = this.type() === 'depense' ? this.depenseList : this.entretienList;
    const total = items.length;
    const errors: string[] = [];

    for (let i = 0; i < total; i++) {
      try {
        const item = { ...items[i], moto: motoId };
        if (this.type() === 'depense') {
          await this.depensesService.save(item);
        } else {
          await this.entretiensService.save(item);
        }
      } catch (e: any) {
        errors.push(`Ligne ${i + 1}: ${e.error?.message || e.message || 'Erreur inconnue'}`);
      }
      this.progress.set(Math.round(((i + 1) / total) * 100));
    }

    this.uploadErrors.set(errors);
    this.isLoading = false;

    if (errors.length === 0) {
      this.saved.emit();
    }
  }

  transformDataToDepense(data: any): void {
    this.depenseList = data
      .filter((depenseData: any) => depenseData.montant !== null && depenseData.date !== null && depenseData.depenseType !== null)
      .map((depenseData: any) => ({
        id: depenseData.id || '',
        montant: depenseData.montant || 0,
        kmParcouru: depenseData.kmParcouru || 0,
        essenceConsomme: depenseData.essenceConsomme || 0,
        consoMoyenne: depenseData.consoMoyenne || 0,
        essencePrice: depenseData.essencePrice || 0,
        commentaire: depenseData.commentaire || '',
        kilometrage: depenseData.kilometrage || 0,
        date: depenseData.date || new Date(),
        depenseType: depenseData.depenseType || '',
        moto: depenseData.moto || ''
      }));
  }

  transformDataToEntretien(data: any): void {
    this.entretienList = data
      .filter((entretienData: any) => entretienData.date !== null)
      .map((entretienData: any) => {
        entretienData.graissage = !!entretienData.graissage;
        entretienData.lavage = !!entretienData.lavage;

        return {
          id: entretienData.id || '',
          graissage: entretienData.graissage || false,
          lavage: entretienData.lavage || false,
          pressionAv: entretienData.pressionAv || 0,
          pressionAr: entretienData.pressionAr || 0,
          kilometrage: entretienData.kilometrage || 0,
          date: entretienData.date || new Date(),
          moto: entretienData.moto || ''
        };
      });
  }

  checkFileDataFormat(data: any): string | undefined {
    let expectedColumns: string[] = [];
    if (this.type() === 'depense') {
      expectedColumns = ['montant', 'date', 'depenseType'];
    } else if (this.type() === 'entretien') {
      expectedColumns = ['date'];
    }

    if (!data.length) {
      return 'Le fichier est vide.';
    }

    const actualColumns = Object.keys(data[0]);
    if (!expectedColumns.every(col => actualColumns.includes(col))) {
      return 'Le fichier XLS ne contient pas toutes les colonnes requises.';
    }

    if (this.type() === 'depense') {
      const invalidData = data.find((depense: any) => {
        const isMontantInvalid = depense.montant !== null && typeof depense.montant !== 'number';
        const isKmParcouruInvalid = depense.kmParcouru ? typeof depense.kmParcouru !== 'number' : false;
        const isEssenceConsommeInvalid = depense.essenceConsomme ? typeof depense.essenceConsomme !== 'number' : false;
        const isKilometrageInvalid = depense.kilometrage ? typeof depense.kilometrage !== 'number' : false;
        const isEssencePriceInvalid = depense.essencePrice ? typeof depense.essencePrice !== 'number' : false;
        const isDateInvalid = typeof depense.date !== 'string' || !/^\d{4}\/\d{2}\/\d{2}$/.test(depense.date);

        return isMontantInvalid || isKmParcouruInvalid || isEssenceConsommeInvalid || isKilometrageInvalid || isEssencePriceInvalid || isDateInvalid;
      });
      if (invalidData) {
        return 'Certaines données ne sont pas du type attendu pour la dépense du ' + invalidData.date;
      }
    }

    if (this.type() === 'entretien') {
      const invalidData = data.find((entretien: any) => {
        const isDateInvalid = typeof entretien.date !== 'string' || !/^\d{4}\/\d{2}\/\d{2}$/.test(entretien.date);
        const isPressionAvInvalid = entretien.pressionAv ? typeof entretien.pressionAv !== 'number' : false;
        const isPressionArInvalid = entretien.pressionAr ? typeof entretien.pressionAr !== 'number' : false;

        return isDateInvalid || isPressionAvInvalid || isPressionArInvalid;
      });
      if (invalidData) {
        return 'Certaines données ne sont pas du type attendu pour l\'entretien du ' + invalidData.date;
      }
    }

    const invalidDateEntries = data.filter((entry: any) => !this.isValidDate(entry.date));
    if (invalidDateEntries.length > 0) {
      return 'Certaines dates ne sont pas valides.';
    }

    return undefined;
  }

  isValidDate(dateString: string): boolean {
    const dateObject = new Date(dateString);
    return !isNaN(dateObject.getTime()) && dateString.trim() !== '';
  }

  getFileName(): string {
    return '../../../assets/files/' + this.templateName;
  }

  private async transformDepenseType(data: any[]): Promise<any[]> {
    for (const depense of data) {
      await this.processDepenseType(depense);
    }
    return data;
  }

  private async processDepenseType(depense: any): Promise<void> {
    const name = depense.depenseType?.toLowerCase();
    const matchingType = this.depensesType().find((type: any) => type.name.toLowerCase() === name);

    if (matchingType) {
      depense.depenseType = matchingType.id;
    } else {
      try {
        const newTypeData = await this.depensesTypeService.save(depense.depenseType);
        depense.depenseType = newTypeData.id;
      } catch {
        const baseUrl = environment.baseUrl;
        const types = await lastValueFrom(this.http.get<any[]>(baseUrl + 'depensesTypes'));
        const existing = types.find((t: any) => t.name.toLowerCase() === name);
        if (existing) {
          depense.depenseType = existing.id;
        }
      }
    }
  }
}
