import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Depense} from "../../models/Depense";
import {Entretien} from "../../models/Entretien";
import {Moto} from "../../models/Moto";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EntretiensService} from "../../services/entretiens/entretiens.service";
import {MotoService} from "../../services/moto/moto.service";
import {StorageService} from "../../services/storage/storage.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-moto-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
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
      console.log(this.moto)
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
    if (this.addOrEdit == 'add') {
      this.form = this.fb.group({
        marque: [null, [Validators.required]],
        modele: [null, [Validators.required]]
      })
    } else {
      this.form = this.fb.group({
        marque: [this.moto.marque, [Validators.required]],
        modele: [this.moto.modele, [Validators.required]]
      })
    }

    this.marqueErrorMessage = 'La marque est obligatoire.';
    this.modeleErrorMessage = 'Le modèle est obligatoire.';
  }

  onSubmitMoto(): void {
    this.moto = this.form.value;
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
}
