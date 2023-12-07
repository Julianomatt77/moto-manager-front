import { Routes } from '@angular/router';
import {AccueilComponent} from "./accueil/accueil.component";
import {ErrorComponent} from "./error/error.component";

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'not-found', component: ErrorComponent },
  { path: '**', redirectTo: 'not-found'}
];
