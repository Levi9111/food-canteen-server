export type TEntryStatus = 'ACTIVE' | 'PASSED_OUT';

export interface IEntry {
  _id?: string;
  entryNo: string;
  status: TEntryStatus;
  startDate?: Date;
  endDate?: Date;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
