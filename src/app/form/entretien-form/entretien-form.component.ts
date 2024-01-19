import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {Depense} from "../../models/Depense";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Entretien} from "../../models/Entretien";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MotoService} from "../../services/moto/moto.service";
import {StorageService} from "../../services/storage/storage.service";
import {DatePipe, NgForOf} from "@angular/common";
import {EntretiensService} from "../../services/entretiens/entretiens.service";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-entretien-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    NgForOf,
    MatSlideToggleModule,
    FormsModule
  ],
  providers: [DatePipe],
  templateUrl: './entretien-form.component.html',
  styleUrl: './entretien-form.component.css'
})
export class EntretienFormComponent {
  @Output() formSubmitted: EventEmitter<Depense>;
  @Input() id!: string;

  form!: FormGroup;
  entretien!: Entretien
  addOrEdit!: string;
  buttonLabel!: string;
  userId!: string;
  motoList: any[] = [];
  submitted: boolean = false;
  dateErrorMessage = '';
  motoErrorMessage = '';

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private entretiensService: EntretiensService,
              private motoService: MotoService,
              private storageService: StorageService,
              public dialogRef: MatDialogRef<EntretienFormComponent>,
              public datePipe: DatePipe
  ) {
    this.formSubmitted = new EventEmitter<Depense>();
    if (data.addOrEdit == 'edit') {
      this.addOrEdit = 'edit';
      this.buttonLabel = 'Mettre à jour';
      this.entretien = data.entretien;
      this.id = this.entretien.id
      // TODO Voir pour affichage de la date lors de l'edit
      // this.depense.date = new Date(this.depense.date)
      this.entretien.moto = data.entretien.moto.id.toString()
    } else {
      this.addOrEdit = 'add';
      this.buttonLabel = 'Ajouter';
      this.entretien = new Entretien(
        '',
        false,
        false,
        0,
        0,
        0,
        new Date(Date.now()),
        '',
      )
    }
  }

  ngOnInit(): void {
    if (this.addOrEdit == 'add') {
      this.form = this.fb.group({
        graissage: null,
        lavage: null,
        pressionAv: null,
        pressionAr: null,
        kilometrage: null,
        date: [null, [Validators.required]],
        moto: ['', [Validators.required]]
      })
    } else {
      this.form = this.fb.group({
        graissage: this.entretien.graissage,
        lavage: this.entretien.lavage,
        pressionAv: this.entretien.pressionAv,
        pressionAr: this.entretien.pressionAr,
        kilometrage: this.entretien.kilometrage,
        date: [this.entretien.date, [Validators.required]],
        moto: [this.entretien.moto, [Validators.required]]
      })
    }

    this.dateErrorMessage = 'La date est obligatoire.';
    this.motoErrorMessage = 'La moto est obligatoire.';

    this.motoService.getMotos().subscribe(data => {
      data.forEach(moto => {
        this.motoList.push({'id': moto.id, 'name': moto.modele})
      })
    })
  }

  onSubmitEntretien(): void {
    this.entretien = this.form.value;
    this.submitted = true;
    if (this.form.valid){
        this.saveEntretien();
    }
  }

  saveEntretien(){
    if (this.addOrEdit == 'add'){
      this.entretiensService.saveEntretien(this.entretien).subscribe(() => {
        this.dialogRef.close();
      });
    } else {
      this.entretiensService.patchEntretien(this.id, this.entretien).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }

  changeFn(e: any) {
    this.entretien.date = e.target.value;
  }

}
