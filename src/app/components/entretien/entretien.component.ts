import { Component } from '@angular/core';
import {User} from "../../models/User";
import {StorageService} from "../../services/storage/storage.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {EntretiensService} from "../../services/entretiens/entretiens.service";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {DepenseFormComponent} from "../../form/depense-form/depense-form.component";
import {CommonModule} from "@angular/common";
import {EntretienFormComponent} from "../../form/entretien-form/entretien-form.component";

@Component({
  selector: 'app-entretien',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './entretien.component.html',
  styleUrl: './entretien.component.css'
})
export class EntretienComponent {
  entretiens: any[] = [];
  user: User;
  isLoading = true;
  error: string;
  dialogRef!: MatDialogRef<ConfirmationDialogComponent>;

  constructor(private entretiensService: EntretiensService, private storageService: StorageService, public dialog: MatDialog){}

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.getAllEntretiens();
  }

  /***************  DISPLAY *****************/
  getAllEntretiens(){

    this.entretiensService.getEntretiens().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.entretiens = data;
        // console.log(this.entretiens)
      },
      error: (err) => {
        this.error = err.error.message
      }
    })

  }

  /*************** CRUD *******************/
  addEntretien() {

    this.dialog
      .open(EntretienFormComponent, {
        data: {
          addOrEdit: 'add',
        },
        width: '80vw',
        height: '75vh',
      })
      .afterClosed()
      .subscribe(() => {
        this.getAllEntretiens();
      });

  }

  editEntretien(entretien: any){

    this.dialog
      .open(EntretienFormComponent, {
        data: {
          entretien: entretien,
          addOrEdit: 'edit',
        },
        width: '80vw',
        height: '75vh',
      })
      .afterClosed()
      .subscribe(() => {
        this.getAllEntretiens();
      });

  }

  openConfirmation(entretien: any) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.confirmMessage =
      'Etes vous sûr de vouloir supprimer cet entretien ?';

    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteEntretien(entretien);
      }
    });
  }

  deleteEntretien(entretien: any){

    this.entretiensService.deleteEntretien(entretien.id).subscribe(()=>{
      this.isLoading = true;
      this.getAllEntretiens()
    })

  }
  /****************************************/
}
