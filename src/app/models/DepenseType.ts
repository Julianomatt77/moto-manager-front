import {User} from "./User";

export class DepenseType {
  private _id: string;
  private _name: string;

  constructor(id: string, name: string
  ) {
    this._id = id;
    this._name = name;
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
}
