import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {User} from "../../models/User";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {StorageService} from "../../services/storage/storage.service";
import {MotoService} from "../../services/moto/moto.service";
import {MotoFormComponent} from "../../form/moto-form/moto-form.component";
import {DepensesService} from "../../services/depenses/depenses.service";
import {EntretiensService} from "../../services/entretiens/entretiens.service";
import {catchError, forkJoin, map, Observable} from "rxjs";

@Component({
  selector: 'app-motos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './motos.component.html',
  styleUrl: './motos.component.css'
})
export class MotosComponent {
  motos: any[] = [];
  deactivatedMotos: any[] = [];
  user: User;
  isLoading = true;
  error: string;
  dialogRef!: MatDialogRef<ConfirmationDialogComponent>;
  depenses: any[] = [];
  entretiens: any[] = [];

  constructor(private motosService: MotoService,
              private storageService: StorageService,
              public dialog: MatDialog,
              private depensesService: DepensesService,
              private entretiensServices: EntretiensService
  ){}

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.loadMotosData();
  }

  loadMotosData(): void {
    this.isLoading = true; // Active l'indicateur de chargement

    const motos$ = this.getAllMotos();
    const deactivatedMotos$ = this.getAllDeactivatedMotos();

    forkJoin([motos$, deactivatedMotos$]).subscribe({
      next: ([motos, deactivatedMotos]) => {
        this.motos = motos;
        this.deactivatedMotos = deactivatedMotos;
        this.getStatsDepenses();
        this.getStatsEntretiens();
      },
      error: (err) => {
        this.error = err.error.message;
        this.isLoading = false;
      }
    });
  }

  getAllMotos(): Observable<any> {
    return this.motosService.getMotos().pipe(
      map(data => data), // Vous pouvez transformer les données ici si nécessaire
    );
  }

  getAllDeactivatedMotos(): Observable<any> {
    return this.motosService.getDeactivatedMotos().pipe(
      map(data => data), // Vous pouvez transformer les données ici si nécessaire
    );
  }

  /*************** CRUD *******************/
  addMoto() {
    this.dialog
      .open(MotoFormComponent, {
        data: {
          addOrEdit: 'add',
        },
        width: '80vw',
        height: '50vh',
      })
      .afterClosed()
      .subscribe(() => {
        this.loadMotosData();
      });

  }

  editMoto(moto: any){
    this.dialog
      .open(MotoFormComponent, {
        data: {
          moto: moto,
          addOrEdit: 'edit',
        },
        width: '80vw',
        height: '50vh',
      })
      .afterClosed()
      .subscribe(() => {
        this.loadMotosData();
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
    this.motosService.deleteMoto(moto.id).subscribe(()=>{
      this.isLoading = true;
      this.loadMotosData();
    })
  }

  reactivateMoto(moto: any){
    this.motosService.reactivateMoto(moto.id).subscribe(()=> {
      this.isLoading = true;
      this.loadMotosData();
    })

  }
  /**************** Stats ************************/
  getStatsDepenses(){
    this.depensesService.getDepenses().subscribe({
      next: (data) => {
        this.depenses = data;

        this.motos.forEach((moto: any)=>{
          let dep = 0;
          let km: number[] = []
          let consos: number[] = []
          let consoMoyenne = 0;
          let litresTotal = 0;

          this.depenses.forEach((depense)=> {
            if (depense.moto.id === moto.id){
              dep += depense.montant
              km.push(depense.kilometrage)

              if (depense.consoMoyenne) {
                consos.push(depense.consoMoyenne)
              }

              if (depense.essenceConsomme){
                litresTotal += depense.essenceConsomme
                litresTotal = Math.round(litresTotal);
              }

            }
          })

          const minKm = Math.min(...km);
          const maxKm = Math.max(...km);
          const kmParcouru = maxKm - minKm;

          // Prix de revient au km
          let prk = kmParcouru> 0 ? dep / kmParcouru : 0
          prk = Number(prk.toFixed(2))

          // Consommation moyenne
          if (consos.length > 0){
            // Calculer la somme des éléments du tableau
            const somme = consos.reduce((acc, valeur) => acc + valeur, 0);
            // Calculer la moyenne
            consoMoyenne = somme / consos.length;
            consoMoyenne = Number(consoMoyenne.toFixed(2))
          }

          moto.prk = prk
          moto.consoMoyenne = consoMoyenne;
          moto.litresTotal = litresTotal;
        })

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error.message
      }
    })

  }

  private getStatsEntretiens() {
    this.entretiensServices.getEntretiens().subscribe({
      next: (data)=> {
        this.entretiens =  data;

        this.motos.forEach((moto: any)=>{
          let graissageDates: number[] = [];
          let pressionDates:number[] = [];

          this.entretiens.forEach((entretien) => {
            if (entretien.moto.id === moto.id){

                if (entretien.graissage){
                  graissageDates.push(this.differenceDate(entretien.date))
                }

                if (entretien.pressionAv > 0){
                  pressionDates.push(this.differenceDate(entretien.date))
                }

            }
          })

          moto.dateLastGraissage = graissageDates.length > 0 ? Math.min(...graissageDates) : null
          moto.dateLastPression = pressionDates.length > 0 ? Math.min(...pressionDates) : null
        })
      },
      error: (err) => {
        this.error = err.error.message
      }
    })
  }

  private differenceDate(entretienDate: any){
    const aujourdHui = new Date();

    const dateEntretien = new Date(entretienDate);
    // Calculez la différence en millisecondes
    const differenceEnMillisecondes =  aujourdHui.getTime() - dateEntretien.getTime();
    // Convertissez la différence en jours
    return Math.floor(differenceEnMillisecondes / (1000 * 60 * 60 * 24));
  }
}
