import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {read, utils} from "xlsx";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Depense} from "../../models/Depense";
import {Entretien} from "../../models/Entretien";
import {DepensesService} from "../../services/depenses/depenses.service";
import {DepensesTypeService} from "../../services/depensesType/depenses-type.service";
import {MotoService} from "../../services/moto/moto.service";
import {Moto} from "../../models/Moto";
import {NgForOf} from "@angular/common";
import {forkJoin} from "rxjs";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {EntretiensService} from "../../services/entretiens/entretiens.service";

@Component({
  selector: 'app-upload-popup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    FormsModule,
    MatProgressBarModule
  ],
  templateUrl: './upload-popup.component.html',
  styleUrl: './upload-popup.component.css'
})
export class UploadPopupComponent {
  @Output() formSubmitted: EventEmitter<Depense>;

  type!: string;
  fileName = '';
  uploadData: any[] = [];
  form!: FormGroup;
  depense!: Depense;
  entretien!: Entretien
  userId!: string;
  depensesType: any[] = [];
  motoList: any[] = [];
  selectedType: string = '';
  submitted: boolean = false;
  depenseList: Depense[] = [];
  entretienList: Entretien[] = [];
  moto!: Moto;
  // motoErrorMessage = 'La moto est obligatoire.';
  isLoading = false;
  fileImported = false;
  fileErrorMessage = '';
  templateName = '';


  constructor(private fb: FormBuilder,
              public dialogRef: MatDialogRef<UploadPopupComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private depensesService: DepensesService,
              private entretiensService: EntretiensService,
              private depensesTypeService: DepensesTypeService,
              private motoService: MotoService,
  ) {
    this.formSubmitted = new EventEmitter<Depense>();
    if (data.type) {
      this.type = data.type;
    }

    this.moto = new Moto(
      '',
      '',
      '',
    )

  }

  ngOnInit(): void {
    this.form = this.fb.group({
      moto: ['', [Validators.required]]
    })

    if (this.type == 'depense') {
      this.depensesTypeService.getDepensesTypes().subscribe((data) => {
        data.forEach((type) => {
          this.depensesType.push({'id': type.id, 'name': type.name})
        })
        this.depensesType.push({'id': 0, 'name': 'autre'})
      })

      this.templateName = 'depense-moto-template.xlsx';
    } else {
      this.templateName = 'entretien-moto-template.xlsx';
    }

    this.motoService.getMotos().subscribe(data => {
      data.forEach(moto => {
        this.motoList.push({'id': moto.id, 'name': moto.modele})
      })
    })
  }

  onFileSelected(event: any) {
    this.isLoading = true;
    this.fileErrorMessage = '';
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

        if (!error){
          if (this.type == 'depense') {
            this.uploadData = await this.transformDepenseType(this.uploadData);
            this.transformDataToDepense(this.uploadData);
          } else {
            this.transformDataToEntretien(this.uploadData);
          }
          this.fileImported = true;
          this.isLoading = false;
        } else {
          this.fileErrorMessage = error;
        }

      }
      reader.readAsArrayBuffer(file);
    }
  }

  onSubmitUpload() {
    this.submitted = true;
    if (this.form.valid && !this.fileErrorMessage) {
      this.isLoading = true;
      if (this.type == 'depense') {
        const saveDepenseObservables = this.depenseList.map((depense: Depense) => {
          depense.moto = this.form.value['moto'];
          return this.depensesService.saveDepense(depense);
        });

        forkJoin(saveDepenseObservables).subscribe(() => {
          this.isLoading = false;
          this.dialogRef.close();
        });
      } else {
        const saveEntretienObservables = this.entretienList.map((entretien: Entretien) => {
          entretien.moto = this.form.value['moto'];
          return this.entretiensService.saveEntretien(entretien);
        });

        forkJoin(saveEntretienObservables).subscribe(() => {
          this.isLoading = false;
          this.dialogRef.close();
        });
      }
    }
  }

  closePopup() {
    this.dialogRef.close();
  }

  transformDataToDepense(data: any) {

    this.depenseList = data
      .filter((depenseData: any) => depenseData.montant !== null && depenseData.date !== null && depenseData.depenseType !== null)
      .map((depenseData: any) => {
        const depense = new Depense(
          depenseData.id || '',
          depenseData.montant || 0,
          depenseData.kmParcouru || 0,
          depenseData.essenceConsomme || 0,
          depenseData.consoMoyenne || 0,
          depenseData.essencePrice || 0,
          depenseData.commentaire || '',
          depenseData.kilometrage || 0,
          depenseData.date || new Date(),
          depenseData.depenseType || '',
          depenseData.moto || ''
        );

        return {
          id: depense.id,
          montant: depense.montant,
          kmParcouru: depense.kmParcouru,
          essenceConsomme: depense.essenceConsomme,
          consoMoyenne: depense.consoMoyenne,
          essencePrice: depense.essencePrice,
          commentaire: depense.commentaire,
          kilometrage: depense.kilometrage,
          date: depense.date,
          depenseType: depense.depenseType,
          moto: depense.moto,
        };
      });
  }

  transformDataToEntretien(data: any) {
    this.entretienList = data
      .filter((entretienData: any) => entretienData.date !== null)
      .map((entretienData: any) => {
        entretienData.graissage = !!entretienData.graissage;
        entretienData.lavage = entretienData.lavage ? true : false;

        const entretien = new Entretien(
            entretienData.id || '',
            entretienData.graissage || false,
            entretienData.lavage || false,
            entretienData.pressionAv || 0,
            entretienData.pressionAr || 0,
            entretienData.kilometrage || 0,
            entretienData.date || new Date(),
            entretienData.moto || '',
          );

          return {
            id: entretien.id,
            graissage: entretien.graissage,
            lavage: entretien.lavage,
            pressionAv: entretien.pressionAv,
            pressionAr: entretien.pressionAr,
            kilometrage: entretien.kilometrage,
            date: entretien.date,
            moto: entretien.moto,
          }
        });
  }

  checkFileDataFormat (data : any){
    // Vérifier l'existence des colonnes attendues
    let expectedColumns: any[] = [];
    if (this.type == 'depense') {
      expectedColumns = ['montant', 'date', 'depenseType'];
    } else if (this.type == 'entretien'){
      expectedColumns = ['date'];
    }
    const actualColumns = Object.keys(data[0]);
    if (!expectedColumns.every(col => actualColumns.includes(col))) {
      console.error('Le fichier XLS ne contient pas toutes les colonnes requises. (montant, date, depenseType');
      return 'Le fichier XLS ne contient pas toutes les colonnes requises.';
    }

    // Vérifier le type des données
    if (this.type == 'depense') {
      const invalidData = data.find((depense: any) => {
        const isMontantInvalid = depense.montant !== null && typeof depense.montant !== 'number';
        const isKmParcouruInvalid = depense.kmParcouru ? typeof depense.kmParcouru !== 'number' : null;
        const isEssenceConsommeInvalid = depense.essenceConsomme ? typeof depense.essenceConsomme !== 'number' : null;
        const isKilometrageInvalid = depense.kilometrage ? typeof depense.kilometrage !== 'number' : null;
        const isEssencePriceInvalid = depense.essencePrice ? typeof depense.essencePrice !== 'number' : null;
        const isDateInvalid = typeof depense.date !== 'string' || !/^\d{4}\/\d{2}\/\d{2}$/.test(depense.date);

        return isMontantInvalid || isKmParcouruInvalid || isEssenceConsommeInvalid || isKilometrageInvalid || isEssencePriceInvalid || isDateInvalid;
      });
      if (invalidData) {
        const errorMessage = 'Certaines données ne sont pas du type attendu pour la dépense du ' + invalidData.date;
        console.error(errorMessage);
        return errorMessage;
      }
    }
    if (this.type == 'entretien') {
      const invalidData = data.find((depense: any) => {
        const isDateInvalid = typeof depense.date !== 'string' || !/^\d{4}\/\d{2}\/\d{2}$/.test(depense.date);
        const isPressionAvInvalid = depense.pressionAv ? typeof depense.pressionAv !== 'number' : null;
        const isPressionArInvalid = depense.pressionAr ? typeof depense.pressionAr !== 'number' : null;

        return  isDateInvalid || isPressionAvInvalid || isPressionArInvalid;
      });
      if (invalidData) {
        const errorMessage = 'Certaines données ne sont pas du type attendu pour l\'entretien du ' + invalidData.date
        console.error(errorMessage);
        return errorMessage;
      }
    }

    // Vérifier le format des dates
    const invalidDateEntries = data.filter((depenseData: any) => !this.isValidDate(depenseData.date));
    if (invalidDateEntries.length > 0) {
      console.error('Certaines dates ne sont pas valides.');
      return 'Certaines dates ne sont pas valides.';
    }

    return ;
  }

  isValidDate(dateString: string): boolean {
    const dateObject = new Date(dateString);
    return !isNaN(dateObject.getTime()) && dateString.trim() !== '';
  }

  getFileName(){
    return '../../../assets/files/' + this.templateName;
  }

  // ************************************************* GESTION DES TYPES DE DEPENSE *******************************
  private async transformDepenseType(data: any[]) {
    // Pour chaque dépense on va vérifier le type de dépense
    for (const depense of data) {
      await this.processDepenseType(depense);
    }
    return data;
  }

  private async processDepenseType(depense: any) {
    const matchingType = this.depensesType.find(type => type.name === depense.depenseType);

    if (matchingType) {
      depense.depenseType = matchingType.id;
    } else {
      // Si le type de dépense n'existe pas encore, on le crée puis on l'ajoute au tableau
      const newTypeData = await this.saveDepenseType(depense.depenseType);
      this.depensesType.push({ 'id': newTypeData.id, 'name': depense.depenseType });
      depense.depenseType = newTypeData.id;
    }
  }

  private saveDepenseType(depenseTypeName: string): Promise<any> {
    return new Promise<any>((resolve) => {
      this.depensesTypeService.saveDepenseType(depenseTypeName).subscribe((newTypeData) => {
        resolve(newTypeData);
      });
    });
  }

}
