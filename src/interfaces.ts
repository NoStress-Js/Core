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
  property: string | null;
  exceptedType: ITypes | ITypes[] | null;
  errorType:
    | 'missingProperty'
    | 'unknownProperty'
    | 'wrongType'
    | 'other'
    | 'typeNotSupported'
    | 'tooLong'
    | 'tooShort'
    | 'tooLow'
    | 'tooHigh'
    | 'invalidEmail'
    | 'invalidPhone'
    | 'invalidPhoneCountry'
    | 'invalidIpFormat'
    | 'failedChecking';
}

export interface IValidator {
  table: string;
  property: string;
  value: any;
}

export interface IConstraint {
  min?: number;
  max?: number;
  email?: boolean;
  phone?: string;
  validator?: ((infos: IValidator) => IError | null) | [k: (infos: IValidator) => IError | null];
}

export interface ICheckSettings {
  strict?: boolean;
  required?: string[];
}

export interface ISettings {
  refreshInterval?: number;
}
