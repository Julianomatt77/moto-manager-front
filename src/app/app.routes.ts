import { Routes } from '@angular/router';
import {AccueilComponent} from "./components/accueil/accueil.component";
import {ErrorComponent} from "./components/error/error.component";
import {LoginComponent} from "./components/login/login.component";
import {DepensesComponent} from "./components/depenses/depenses.component";
import {authGuard} from "./guards/auth.guard";

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  {path: 'login', component: LoginComponent},
  {path: 'depenses', canActivate: [authGuard], component: DepensesComponent},
  { path: 'not-found', component: ErrorComponent },
  { path: '**', redirectTo: 'not-found'}
];
