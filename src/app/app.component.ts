import {Component, Inject} from '@angular/core';
import {CommonModule, DOCUMENT} from '@angular/common';
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
  constructor(private metaService: Meta, @Inject(DOCUMENT) private document: Document) {
    this.metaService.addTags([
      {
        name: 'title',
        content: 'Moto Manager',
      },
      {
        name: 'author',
        content: 'Julien MARTIN',
      },
      {
        name: 'description',
        content: 'Moto Manager est votre nouvelle application vous permettant de suivre les dépenses et entretiens réguliers de vos motos',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      },
      {
        name: 'robots',
        content: 'index, follow',
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
        content: 'Moto Manager est votre nouvelle application vous permettant de suivre les dépenses et entretiens réguliers de vos motos',
      },
      {
        property: 'og:url',
        content: 'https://moto-manager.martin-julien-dev.fr',
      },
      {
        property: 'og:image',
        content: 'https://moto-manager.martin-julien-dev.fr/assets/images/moto-manager.png',
      },
    ])
  }

  ngOnInit() {
    this.document.documentElement.lang = 'fr';
  }

}
