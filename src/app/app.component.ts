import {Component, inject, ChangeDetectionStrategy, DOCUMENT} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {Meta} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private document = inject<Document>(DOCUMENT);
  private metaService = inject(Meta);

  constructor() {
    this.metaService.addTags([
      { name: 'title', content: 'Moto Manager' },
      { name: 'author', content: 'Julien MARTIN' },
      { name: 'description', content: 'Moto Manager est votre nouvelle application vous permettant de suivre les dépenses et entretiens réguliers de vos motos' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'Moto Manager' },
      { property: 'og:site_name', content: 'Moto Manager' },
      { property: 'og:type', content: 'website' },
      { property: 'og:description', content: 'Moto Manager est votre nouvelle application vous permettant de suivre les dépenses et entretiens réguliers de vos motos' },
      { property: 'og:url', content: 'https://moto-manager.martin-julien-dev.fr' },
      { property: 'og:image', content: 'https://moto-manager.martin-julien-dev.fr/assets/images/moto-manager.png' },
    ]);

    this.document.documentElement.lang = 'fr';
  }
}
