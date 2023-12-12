import {Component} from '@angular/core';
import {DepensesService} from "../../services/depenses/depenses.service";
import {StorageService} from "../../services/storage/storage.service";
import {User} from "../../models/User";
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {DatePipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-depenses',
  standalone: true,
  imports: [MatTableModule, NgForOf, NgIf],
  templateUrl: './depenses.component.html',
  styleUrl: './depenses.component.css',
})
export class DepensesComponent {

  depenses: any[] = [];
  user: User;
  isLoading = true;
  error: string;

  displayedColumns: string[] = ['consoMoyenne', 'date', 'depenseType', 'essenceConsomme', 'essencePrice', 'essenceType', 'id', 'kmParcouru', 'montant', 'moto'];
  dataSource: MatTableDataSource<any>;

  constructor(private depensesService: DepensesService,
              private storageService: StorageService
  ){
  }

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.depensesService.getDepenses().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.depenses = data;
        console.log(this.depenses)

        const datePipe = new DatePipe('en-US');
        this.depenses.forEach((depense) => {
          depense.date = datePipe.transform(depense.date, 'dd/MM/yyyy');
        });

        // console.log(this.depenses)
        this.dataSource = new MatTableDataSource(this.depenses);
      },
      error: (err) => {
        this.error = err.error.message
      }
    })
  }

  getColumnLabel(column: string): string {
    // Ajoutez la logique pour renvoyer les noms personnalisés correspondants à chaque colonne
    switch (column) {
      case 'modele':
        return 'Modèle';
      case 'consoMoyenne':
        return 'Conso Moyenne';
      case 'essenceConsomme':
        return 'Conso';
      default:
        return column;
    }
  }

}
