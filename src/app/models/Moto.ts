import {User} from "./User";

export class Moto{
  private _id: string;
  private _marque: string;
  private _modele: string;
  private _user: User;


  constructor(id: string, marque: string, modele: string, user: User) {
    this._id = id;
    this._marque = marque;
    this._modele = modele;
    this._user = user;
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

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }
}
