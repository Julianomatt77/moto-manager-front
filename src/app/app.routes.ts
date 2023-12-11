import { Routes } from '@angular/router';
import {AccueilComponent} from "./components/accueil/accueil.component";
import {ErrorComponent} from "./components/error/error.component";
import {LoginComponent} from "./components/login/login.component";
import {DepensesComponent} from "./components/depenses/depenses.component";

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  {path: 'login', component: LoginComponent},
  {path: 'depenses', component: DepensesComponent},
  { path: 'not-found', component: ErrorComponent },
  { path: '**', redirectTo: 'not-found'}
];
