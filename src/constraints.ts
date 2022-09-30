import { IConstraint, IError } from './interfaces';
import * as phone from 'google-libphonenumber';

const phoneUtil = phone.PhoneNumberUtil.getInstance();
const list: { [k: string]: string } = {};
for (const code of phoneUtil.getSupportedRegions()) list[code] = '';

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
    if (c.email && !validateEmail(val))
      return {
        error: `Invalid email format var "${varName}".`,
        table,
      };
    if (c.phone) {
      const code = c.phone.toUpperCase();
      if (list[code] === undefined)
        return {
          error: `Invalid country code var "${varName}"`,
          table,
        };
      if (!phoneUtil.isValidNumber(phoneUtil.parse(val, code)))
        return {
          error: `Invalid phone format var "${varName}".`,
          table,
        };
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
