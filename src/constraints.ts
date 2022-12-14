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
        error: `Invalid length for property "${varName}". Min length set to ${c.min}.`,
        table,
        property: varName,
        exceptedType: null,
        errorType: 'tooShort',
      };
    if (c.max && val.length > c.max)
      return {
        error: `Invalid length for property "${varName}". Max length set to ${c.max}.`,
        table,
        property: varName,
        exceptedType: null,
        errorType: 'tooLong',
      };
    if (c.email && !validateEmail(val))
      return {
        error: `Invalid email format for property "${varName}".`,
        table,
        property: varName,
        exceptedType: null,
        errorType: 'invalidEmail',
      };
    if (c.phone) {
      const code = c.phone.toUpperCase();
      if (list[code] === undefined)
        return {
          error: `Invalid country code for property "${varName}"`,
          table,
          property: varName,
          exceptedType: null,
          errorType: 'invalidPhoneCountry',
        };
      if (!phoneUtil.isValidNumber(phoneUtil.parse(val, code)))
        return {
          error: `Invalid phone format for property "${varName}".`,
          table,
          property: varName,
          exceptedType: null,
          errorType: 'invalidPhone',
        };
    }
  } else if (typeof val === 'number') {
    if (c.min && val < c.min)
      return {
        error: `Value too low for property "${varName}". Min set to ${c.min}.`,
        table,
        property: varName,
        exceptedType: null,
        errorType: 'tooLow',
      };
    if (c.max && val > c.max)
      return {
        error: `Value too high for property "${varName}". Max set to ${c.max}.`,
        table,
        property: varName,
        exceptedType: null,
        errorType: 'tooHigh',
      };
  }
  if (c.validator) {
    if (typeof c.validator === 'function') {
      const r = c.validator({
        table,
        property: varName,
        value: val,
      });
      if (r != null) return r;
    } else {
      for (const v of c.validator) {
        const r = v({
          table,
          property: varName,
          value: val,
        });
        if (r != null) return r;
      }
    }
  }
  return null;
}
