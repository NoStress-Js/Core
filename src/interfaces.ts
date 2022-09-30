export type ITypes = 'string' | 'int' | 'decimal';

export type ISqlTypes = 'string' | 'int' | 'enum' | 'decimal';

export const SqlToJs: Record<ISqlTypes, ITypes | ITypes[]> = {
  decimal: ['decimal', 'int'],
  int: 'int',
  string: 'string',
  enum: 'string',
};

export interface IColDef {
  name: string;
  type: string;
  colType: string;
  maxChar: number | null;
  autoIncrement: boolean;
  default: string | null;
  nullable: string;
}

export interface ITableDef {
  exceptedType: ITypes | ITypes[];
  sqlType: ISqlTypes;
  type: string;
  enum: string[];
  nullable: boolean;
  length: number | null;
  signed: boolean;
  min: number | null;
  max: number | null;
}

export interface IError {
  error: string;
  table: string;
}

export interface IConstraint {
  min?: number;
  max?: number;
  email?:
    | boolean
    | {
        whitelistDomains?: string[];
        blacklistDomains?: string[];
      };
  phone?: string;
  validator?: ((val: any, key: string) => IError | null) | [k: (val: any, key: string) => IError | null];
}

export interface ICheckSettings {
  strict?: boolean;
  required?: string[];
}

export interface ISettings {
  refreshInterval?: number;
}
