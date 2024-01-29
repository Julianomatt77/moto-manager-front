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


  constructor(private fb: FormBuilder,
              public dialogRef: MatDialogRef<UploadPopupComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private depensesService: DepensesService,
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
      reader.onload = (event: any) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          this.uploadData = rows;
        }

        this.isLoading = false;

        const error = this.checkFileDataFormat(this.uploadData);

        if (!error){
          this.transformDataToDepense(this.uploadData);
          this.fileImported = true;
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
        const saveDepenseObservables = this.depenseList.map((depense: Depense) => {
          depense.moto = this.form.value['moto'];
          return this.depensesService.saveDepense(depense);
        });

        forkJoin(saveDepenseObservables).subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  closePopup() {
    this.dialogRef.close();
  }

  transformDataToDepense(data: any) {
    if (this.type == 'depense') {
      data = this.checkDepenseType(data)
    }

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

  checkDepenseType(data: any) {
    data.forEach((depense: any) => {
      const matchingType = this.depensesType.find(type => type.name == depense.depenseType);
      if (matchingType) {
        depense.depenseType = matchingType.id;
      } else {
        this.depensesTypeService.saveDepenseType(depense.depenseType).subscribe((newTypeData) => {
          depense.depenseType = newTypeData.id;
        });
      }
    })
    return data;
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
        return typeof depense.montant !== 'number' || typeof depense.date !== 'string';
      });
      if (invalidData) {
        console.error('Certaines données ne sont pas du type attendu.');
        return 'Certaines données ne sont pas du type attendu.';
      }
    }
    if (this.type == 'entretien') {
      const invalidData = data.find((depense: any) => {
        return typeof depense.date !== 'string';
      });
      if (invalidData) {
        console.error('Certaines données ne sont pas du type attendu.');
        return 'Certaines données ne sont pas du type attendu.';
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

}
