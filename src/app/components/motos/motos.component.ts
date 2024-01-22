import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {User} from "../../models/User";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {StorageService} from "../../services/storage/storage.service";
import {MotoService} from "../../services/moto/moto.service";
import {EntretienFormComponent} from "../../form/entretien-form/entretien-form.component";
import {MotoFormComponent} from "../../form/moto-form/moto-form.component";

@Component({
  selector: 'app-motos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './motos.component.html',
  styleUrl: './motos.component.css'
})
export class MotosComponent {
  motos: any[] = [];
  user: User;
  isLoading = true;
  error: string;
  dialogRef!: MatDialogRef<ConfirmationDialogComponent>;

  constructor(private motosService: MotoService, private storageService: StorageService, public dialog: MatDialog){}

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.getAllMotos();
  }

  /***************  DISPLAY *****************/
  getAllMotos(){
    this.motosService.getMotos().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.motos = data;
        console.log(this.motos)
      },
      error: (err) => {
        this.error = err.error.message
      }
    })

  }

  /*************** CRUD *******************/
  addMoto() {
    this.dialog
      .open(MotoFormComponent, {
        data: {
          addOrEdit: 'add',
        },
        width: '80vw',
        height: '65vh',
      })
      .afterClosed()
      .subscribe(() => {
        this.getAllMotos();
      });

  }

  editMoto(moto: any){
    console.log(moto)
    this.dialog
      .open(MotoFormComponent, {
        data: {
          moto: moto,
          addOrEdit: 'edit',
        },
        width: '80vw',
        height: '65vh',
      })
      .afterClosed()
      .subscribe(() => {
        this.getAllMotos();
      });
  }

  openConfirmation(moto: any) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.confirmMessage =
      'Etes vous sûr de vouloir supprimer cette moto (' + moto.marque + ' ' + moto.modele + ')?';

    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteMoto(moto);
      }
    });
  }

  deleteMoto(moto: any){
    console.log(moto.id)
    this.motosService.deleteMoto(moto.id).subscribe(()=>{
      this.isLoading = true;
      this.getAllMotos()
    })

  }
  /****************************************/

}
