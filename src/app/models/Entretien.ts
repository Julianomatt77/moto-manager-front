import {User} from "./User";
import {Moto} from "./Moto";

export class Entretien {
  private _id: string;
  private _graissage: boolean;
  private _lavage: boolean;
  private _pressionAv: number;
  private _pressionAr: number;
  private _kilometrage: number;
  private _date: Date;
  // private _user: User;
  // private _moto: Moto;
  private _moto: string;


  constructor(id: string, graissage: boolean, lavage: boolean, pressionAv: number, pressionAr: number, kilometrage: number, date: Date, moto: string) {
    this._id = id;
    this._graissage = graissage;
    this._lavage = lavage;
    this._pressionAv = pressionAv;
    this._pressionAr = pressionAr;
    this._kilometrage = kilometrage;
    this._date = date;
    // this._user = user;
    this._moto = moto;
  }


  get id(): string {
    return this._id;
  }


  get graissage(): boolean {
    return this._graissage;
  }

  set graissage(value: boolean) {
    this._graissage = value;
  }

  get lavage(): boolean {
    return this._lavage;
  }

  set lavage(value: boolean) {
    this._lavage = value;
  }

  get pressionAv(): number {
    return this._pressionAv;
  }

  set pressionAv(value: number) {
    this._pressionAv = value;
  }

  get pressionAr(): number {
    return this._pressionAr;
  }

  set pressionAr(value: number) {
    this._pressionAr = value;
  }

  get kilometrage(): number {
    return this._kilometrage;
  }

  set kilometrage(value: number) {
    this._kilometrage = value;
  }

  get date(): Date {
    return this._date;
  }

  set date(value: Date) {
    this._date = value;
  }
/*
  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }
*/
  get moto(): string {
    return this._moto;
  }

  set moto(value: string) {
    this._moto = value;
  }
}
