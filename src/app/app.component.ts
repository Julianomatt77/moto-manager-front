import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {Meta} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private metaService: Meta,) {
    this.metaService.addTags([
      {
        name: 'author',
        content: 'Julien MARTIN',
      },
      {
        name: 'description',
        content: 'Gérer les dépenses et entretiens réguliers de vos motos',
      },
      {
        property: 'og:title',
        content: 'Moto Manager',
      },
      {
        property: 'og:site_name',
        content: 'Moto Manager',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:description',
        content: 'Gérer les dépenses et entretiens réguliers de vos motos',
      },
      {
        property: 'og:url',
        content: 'https://moto-manager.martin-julien-dev.fr',
      },
      {
        property: 'og:image',
        content: 'assets/images/moto-manager.png',
      },
    ])
  }
}
