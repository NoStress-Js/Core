import { IColDef, ISqlTypes } from './interfaces';

export class Database {
  public types: { [k: string]: ISqlTypes } = {};
  public numbersSize: {
    [k: string]: { signed: { min: number; max: number }; unsigned: { min: number; max: number } };
  } = {};

  public async GetDbDefinition(table: string): Promise<IColDef[]> {
    return [];
  }
}
