import {User} from "./User";
import {Moto} from "./Moto";
import {DepenseType} from "./DepenseType";

export class Depense {
  private _id: string;
  private _montant: number;
  private _kmParcouru: number;
  private _essenceConsomme: number;
  private _consoMoyenne: number;
  private _essencePrice: string;
  private _kilometrage: number;
  private _date: Date;
  private _depenseType: DepenseType;
  private _user: User;
  private _moto: Moto;


  constructor(id: string, montant: number, kmParcouru: number, essenceConsomme: number, consoMoyenne: number, essencePrice: string, kilometrage: number, date: Date, depenseType: DepenseType, user: User, moto: Moto) {
    this._id = id;
    this._montant = montant;
    this._kmParcouru = kmParcouru;
    this._essenceConsomme = essenceConsomme;
    this._consoMoyenne = consoMoyenne;
    this._essencePrice = essencePrice;
    this._kilometrage = kilometrage;
    this._date = date;
    this._depenseType = depenseType;
    this._user = user;
    this._moto = moto;
  }

  get id(): string {
    return this._id;
  }

  get montant(): number {
    return this._montant;
  }

  set montant(value: number) {
    this._montant = value;
  }

  get kmParcouru(): number {
    return this._kmParcouru;
  }

  set kmParcouru(value: number) {
    this._kmParcouru = value;
  }

  get essenceConsomme(): number {
    return this._essenceConsomme;
  }

  set essenceConsomme(value: number) {
    this._essenceConsomme = value;
  }

  get consoMoyenne(): number {
    return this._consoMoyenne;
  }

  set consoMoyenne(value: number) {
    this._consoMoyenne = value;
  }

  get essencePrice(): string {
    return this._essencePrice;
  }

  set essencePrice(value: string) {
    this._essencePrice = value;
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

  get depenseType(): DepenseType {
    return this._depenseType;
  }

  set depenseType(value: DepenseType) {
    this._depenseType = value;
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  get moto(): Moto {
    return this._moto;
  }

  set moto(value: Moto) {
    this._moto = value;
  }
}
