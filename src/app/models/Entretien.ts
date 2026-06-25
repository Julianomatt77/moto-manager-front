export interface EntretienMoto {
  id: string;
  modele: string;
}

export interface Entretien {
  id: string;
  graissage: boolean;
  lavage: boolean;
  pressionAv: number;
  pressionAr: number;
  kilometrage: number;
  date: Date;
  moto: EntretienMoto;
}
