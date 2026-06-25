export interface DepenseMoto {
  id: string;
  modele: string;
}

export interface DepenseTypeInfo {
  id: string;
  name: string;
}

export interface Depense {
  id: string;
  montant: number;
  kmParcouru: number;
  essenceConsomme: number;
  consoMoyenne: number;
  essencePrice: number;
  commentaire: string;
  kilometrage: number;
  date: Date;
  depenseType: DepenseTypeInfo;
  moto: DepenseMoto;
}
