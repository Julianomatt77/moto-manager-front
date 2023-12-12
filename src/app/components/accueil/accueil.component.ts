import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit{
  isPageReloaded: boolean = false;

  constructor() {}

  ngOnInit(): void {
    const hasReloaded = window.sessionStorage.getItem('mm_hasReloaded');
    if (!hasReloaded) {
      window.sessionStorage.setItem('mm_hasReloaded', 'true');
      window.location.reload();
    }
  }
}
