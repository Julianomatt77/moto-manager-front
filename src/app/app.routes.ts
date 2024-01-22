import { Routes } from '@angular/router';
import {AccueilComponent} from "./components/accueil/accueil.component";
import {ErrorComponent} from "./components/error/error.component";
import {LoginComponent} from "./components/login/login.component";
import {DepensesComponent} from "./components/depenses/depenses.component";
import {authGuard} from "./guards/auth.guard";
import {EntretienComponent} from "./components/entretien/entretien.component";
import {MotosComponent} from "./components/motos/motos.component";

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: LoginComponent, data:{registration:true}},
  {path: 'depenses', canActivate: [authGuard], component: DepensesComponent},
  {path: 'entretien', canActivate: [authGuard], component: EntretienComponent},
  {path: 'motos', canActivate: [authGuard], component: MotosComponent},
  { path: 'not-found', component: ErrorComponent },
  { path: '**', redirectTo: 'not-found'}
];
