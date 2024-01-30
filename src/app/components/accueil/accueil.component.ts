import {Component, OnInit} from '@angular/core';
import {StorageService} from "../../services/storage/storage.service";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit{
  isPageReloaded: boolean = false;
  isLoggedIn: boolean;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    const hasReloaded = window.sessionStorage.getItem('mm_hasReloaded');
    if (!hasReloaded) {
      window.sessionStorage.setItem('mm_hasReloaded', 'true');
      window.location.reload();
    }

    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
  }
}
