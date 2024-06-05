import {User} from "./User";

export class Moto{
  private _id: string;
  private _marque: string;
  private _modele: string;
  private _year: number | null;

  constructor(id: string, marque: string, modele: string, year?: number | null) {
    this._id = id;
    this._marque = marque;
    this._modele = modele;
    this._year = year !== undefined ? year : null;
  }


  get id(): string {
    return this._id;
  }


  get marque(): string {
    return this._marque;
  }

  set marque(value: string) {
    this._marque = value;
  }

  get modele(): string {
    return this._modele;
  }

  set modele(value: string) {
    this._modele = value;
  }


  get year(): number | null {
    return this._year;
  }

  set year(value: number | null) {
    this._year = value;
  }
}
