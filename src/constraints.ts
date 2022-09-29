import { IConstraint, IError } from './interfaces';

export function TestConstraint(val: any, c: IConstraint, table: string, varName: string): IError | null {
  if (typeof val === 'string') {
    if (c.min && val.length < c.min)
      return {
        error: `Invalid length for var "${varName}". Min length set to ${c.min}.`,
        table,
      };
    if (c.max && val.length > c.max)
      return {
        error: `Invalid length for var "${varName}". Max length set to ${c.max}.`,
        table,
      };
  } else if (typeof val === 'number') {
    if (c.min && val < c.min)
      return {
        error: `Var "${varName}" too low. Min set to ${c.min}.`,
        table,
      };
    if (c.max && val > c.max)
      return {
        error: `Var "${varName}" too high. Max set to ${c.max}.`,
        table,
      };
  }
  return null;
}
