import { ITypes, SqlToJs } from './interfaces';

export function ParseJsType(val: any): ITypes | null {
  if (typeof val === 'string') return 'string';
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return 'int';
    else return 'decimal';
  }
  return null;
}

export function CheckTypes(excepted: ITypes | ITypes[], inputType: ITypes): boolean {
  if (typeof excepted === 'string') {
    if (SqlToJs[excepted] != inputType) return false;
  } else {
    for (const e of excepted) if (SqlToJs[e] != inputType) return false;
  }
  return true;
}

export function ParseEnum(val: string): string[] {
  return [];
}

export function IsSigned(val: string): boolean {
  return !val.includes('unsigned');
}

export function ParseNumberSize(sqlType: string, signed: boolean): [number | null, number | null] {
  const l = globalThis.nostress.db?.numbersSize[sqlType];
  if (l) {
    if (signed) return [l.signed.min, l.signed.max];
    else return [l.unsigned.min, l.unsigned.max];
  }
  return [null, null];
}
