import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DepensesService} from "../../services/depenses/depenses.service";
import {Depense} from "../../models/Depense";
import {StorageService} from "../../services/storage/storage.service";
import {DepenseType} from "../../models/DepenseType";
import {DepensesTypeService} from "../../services/depensesType/depenses-type.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MotoService} from "../../services/moto/moto.service";

@Component({
  selector: 'app-depense-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    FormsModule,
    NgForOf,
    NgIf,
  ],
  providers: [DatePipe],
  templateUrl: './depense-form.component.html',
  styleUrl: './depense-form.component.css'
})
export class DepenseFormComponent implements OnInit{
  @Output() formSubmitted: EventEmitter<Depense>;
  @Input() id!: string;

  form!: FormGroup;
  depense!: Depense;
  addOrEdit!: string;
  buttonLabel!: string;
  userId!: string;
  depensesType: any[] = [];
  motoList: any[] = [];

  montantErrorMessage = '';
  dateErrorMessage = '';
  depenseTypeErrorMessage = '';
  motoErrorMessage = '';

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private depensesService: DepensesService,
    private depensesTypeService: DepensesTypeService,
    private motoService: MotoService,
    private storageService: StorageService,
    public dialogRef: MatDialogRef<DepenseFormComponent>,
    public datePipe: DatePipe
  ) {
    this.formSubmitted = new EventEmitter<Depense>();
    if (data.addOrEdit == 'edit') {
      this.addOrEdit = 'edit';
      this.buttonLabel = 'Mettre à jour';
      this.depense = data.depense;
      this.id = this.depense.id
      // TODO Voir pour affichage de la date
      // console.log(typeof this.depense.date)
      // this.depense.date = new Date(this.depense.date)
      this.depense.moto = data.depense.moto.id.toString()
      this.depense.depenseType = data.depense.depenseType.id.toString()
      // console.log(typeof this.depense.date)
    } else {
      this.addOrEdit = 'add';
      this.buttonLabel = 'Ajouter';
      this.depense = new Depense(
        '',
        0,
        0,
        0,
        0,
        '',
        '',
        0,
        new Date(Date.now()),
        '',
        '',
      )
    }
  }

  ngOnInit(): void {
    if (this.addOrEdit == 'add') {
      this.form = this.fb.group({
        montant: [null, [Validators.required]],
        kmParcouru: null,
        essenceConsomme: null,
        essencePrice: null,
        commentaire: null,
        kilometrage: null,
        date: [null, [Validators.required]],
        depense_type: ['', [Validators.required]],
        moto: ['', [Validators.required]]
      })
    } else {
      this.form = this.fb.group({
        montant: [this.depense.montant, [Validators.required]],
        kmParcouru: this.depense.kmParcouru,
        essenceConsomme: this.depense.essenceConsomme,
        essencePrice: this.depense.essencePrice,
        commentaire: this.depense.commentaire,
        kilometrage: this.depense.kilometrage,
        date: [, [Validators.required]],
        depense_type: [this.depense.depenseType, [Validators.required]],
        moto: [this.depense.moto, [Validators.required]]
      })
    }

    this.montantErrorMessage = 'Le montant est obligatoire.';
    this.dateErrorMessage = 'La date est obligatoire.';
    this.depenseTypeErrorMessage = 'Le type de dépense est obligatoire.';
    this.motoErrorMessage = 'La moto est obligatoire.';

    this.depensesTypeService.getDepensesTypes().subscribe((data) => {
      data.forEach((type) => {
        this.depensesType.push({'id': type.id, 'name': type.name})
      })
    })

    this.motoService.getMotos().subscribe(data => {
      data.forEach(moto => {
        this.motoList.push({'id': moto.id, 'name': moto.modele})
      })
    })
  }

  onSubmitDepense(): void {
    this.depense = this.form.value;
    if (this.addOrEdit == 'add'){
      this.depensesService.saveDepense(this.depense).subscribe(() => {
        this.dialogRef.close();
      });
    } else {
      this.depensesService.patchDepense(this.id, this.depense).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }

  changeFn(e: any) {
    this.depense.date = e.target.value;
  }
}
