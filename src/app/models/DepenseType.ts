import {User} from "./User";

export class DepenseType {
  private _id: string;
  private _name: string;
  private _user: User;


  constructor(id: string, name: string, user: User) {
    this._id = id;
    this._name = name;
    this._user = user;
  }


  get id(): string {
    return this._id;
  }


  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }
}
