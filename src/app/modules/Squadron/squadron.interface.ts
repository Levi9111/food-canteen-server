export interface ISquadron {
  _id?: string;
  name: string;
  rooms: string[];
  isActive: boolean;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
