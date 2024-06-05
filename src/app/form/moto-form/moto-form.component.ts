import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Depense} from "../../models/Depense";
import {Entretien} from "../../models/Entretien";
import {Moto} from "../../models/Moto";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EntretiensService} from "../../services/entretiens/entretiens.service";
import {MotoService} from "../../services/moto/moto.service";
import {StorageService} from "../../services/storage/storage.service";
import {DatePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-moto-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './moto-form.component.html',
  styleUrl: './moto-form.component.css'
})
export class MotoFormComponent {
  @Output() formSubmitted: EventEmitter<Depense>;
  @Input() id!: string;

  form!: FormGroup;
  moto!: Moto
  addOrEdit!: string;
  buttonLabel!: string;
  userId!: string;
  submitted: boolean = false;
  marqueErrorMessage = '';
  modeleErrorMessage = '';
  years: number[];

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private motoService: MotoService,
              private storageService: StorageService,
              public dialogRef: MatDialogRef<MotoFormComponent>,
  ) {
    this.formSubmitted = new EventEmitter<Depense>();

    if (data.addOrEdit == 'edit') {
      this.addOrEdit = 'edit';
      this.buttonLabel = 'Mettre à jour';
      this.moto = data.moto;
      this.id = this.moto.id
    } else {
      this.addOrEdit = 'add';
      this.buttonLabel = 'Ajouter';
      this.moto = new Moto(
        '',
        '',
        '',
      )
    }
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = currentYear; year >= 1900; year--) {
      this.years.push(year);
    }

    if (this.addOrEdit == 'add') {
      this.form = this.fb.group({
        marque: [null, [Validators.required]],
        modele: [null, [Validators.required]],
        year: null
      })
    } else {
      this.form = this.fb.group({
        marque: [this.moto.marque, [Validators.required]],
        modele: [this.moto.modele, [Validators.required]],
        year: this.moto.year
      })
    }

    this.marqueErrorMessage = 'La marque est obligatoire.';
    this.modeleErrorMessage = 'Le modèle est obligatoire.';
  }

  onSubmitMoto(): void {
    this.moto = this.form.value;
    this.moto.year = this.moto.year !== null ? +this.moto.year : null; // Convert to number
    this.submitted = true;
    if (this.form.valid){
      this.saveMoto();
    }
  }

  private saveMoto() {
    if (this.addOrEdit == 'add'){
      this.motoService.saveMoto(this.moto).subscribe(() => {
        this.dialogRef.close();
      });
    } else {
      this.motoService.patchMoto(this.id, this.moto).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }

  closePopup(){
    this.dialogRef.close();
  }

}
