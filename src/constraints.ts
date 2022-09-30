import { IConstraint, IError } from './interfaces';
import * as phone from 'google-libphonenumber';

const phoneUtil = phone.PhoneNumberUtil.getInstance();

const validateEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
};

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
    switch (c.format) {
      case 'email':
        if (!validateEmail(val))
          return {
            error: `Invalid email format var "${varName}".`,
            table,
          };
        break;
      case 'phone':
        if (!phoneUtil.isValidNumber(phoneUtil.parse(val, 'FR')))
          return {
            error: `Invalid phone format var "${varName}".`,
            table,
          };
        break;
    }
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

export class Constraint {
  public _c: IConstraint = {};
  min(val: number): Constraint {
    this._c.min = val;
    return this;
  }
  max(val: number): Constraint {
    this._c.max = val;
    return this;
  }
}
