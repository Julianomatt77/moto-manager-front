import {Component} from '@angular/core';
import {DepensesService} from "../../services/depenses/depenses.service";
import {StorageService} from "../../services/storage/storage.service";
import {User} from "../../models/User";
import {DatePipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-depenses',
  standalone: true,
  imports: [NgForOf, NgIf],
  templateUrl: './depenses.component.html',
  styleUrl: './depenses.component.css',
})
export class DepensesComponent {

  depenses: any[] = [];
  user: User;
  isLoading = true;
  error: string;

  constructor(private depensesService: DepensesService, private storageService: StorageService){}

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.depensesService.getDepenses().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.depenses = data;
        // console.log(this.depenses)

        const datePipe = new DatePipe('en-US');
        this.depenses.forEach((depense) => {
          depense.date = datePipe.transform(depense.date, 'dd/MM/yyyy');
        });

      },
      error: (err) => {
        this.error = err.error.message
      }
    })
  }

}
