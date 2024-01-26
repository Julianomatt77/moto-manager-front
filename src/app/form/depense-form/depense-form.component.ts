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
  selectedType: string = '';
  submitted: boolean = false;

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
      // TODO Voir pour affichage de la date lors de l'edit
      // this.depense.date = new Date(this.depense.date)
      this.depense.moto = data.depense.moto.id.toString()
      this.depense.depenseType = data.depense.depenseType.id.toString()
    } else {
      this.addOrEdit = 'add';
      this.buttonLabel = 'Ajouter';
      this.depense = new Depense(
        '',
        0,
        0,
        0,
        0,
        0,
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
        depenseType: ['', [Validators.required]],
        autre_depense: '',
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
        date: [this.depense.date, [Validators.required]],
        depenseType: [this.depense.depenseType, [Validators.required]],
        autre_depense: '',
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
      this.depensesType.push({'id': 0, 'name': 'autre'})
    })

    this.motoService.getMotos().subscribe(data => {
      data.forEach(moto => {
        this.motoList.push({'id': moto.id, 'name': moto.modele})
      })
    })
  }

  onSubmitDepense(): void {
    this.depense = this.form.value;
    this.submitted = true;
    if (this.form.valid){
      if (this.form.value['depenseType'] == '0' && this.form.value['autre_depense']){
        let newTypeName = this.form.value['autre_depense'];
        this.depensesTypeService.saveDepenseType(newTypeName).subscribe((data) => {
          this.depense.depenseType = data.id
          this.saveDepense();
        })
      } else {
        this.saveDepense();
      }
    }
  }

  saveDepense(){
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

  onTypeSelection(e: any) {
    this.selectedType = e.target.value.split(':')[1].trim()
  }

  closePopup(){
    this.dialogRef.close();
  }

}
