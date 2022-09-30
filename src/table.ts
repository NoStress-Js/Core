import { TestConstraint } from './constraints';
import { ICheckSettings, IConstraint, IError, ITableDef, SqlToJs } from './interfaces';
import { CheckTypes, IsSigned, ParseEnum, ParseJsType, ParseNumberSize } from './types';
import { waitUntil } from 'async-wait-until';

function ShowError(msg: string) {
  console.log('\x1b[31m', `[ERROR] NoStress: ${msg}`, '\x1b[0m');
}

export class Table {
  private table: string = '';
  private constraints: { [k: string]: IConstraint } = {};
  private tableDef: { [key: string]: ITableDef } = {};
  private required: string[] = [];

  constructor(table: string) {
    if (table == '') {
      ShowError('Table name cannot be empty!');
    } else {
      this.table = table;
      if (!globalThis.nostress)
        globalThis.nostress = {
          db: null,
          tables: [],
        };
      globalThis.nostress.tables.push(this);
    }
  }

  public Constraints(constraints: { [k: string]: IConstraint }) {
    this.constraints = constraints;
  }

  public async Load() {
    if (!globalThis.nostress.db || globalThis.nostress.db == null)
      await waitUntil(() => globalThis.nostress.db && globalThis.nostress.db != null);
    if (globalThis.nostress.db) {
      try {
        const def = await globalThis.nostress.db?.GetDbDefinition(this.table);
        if (!def) return ShowError(`Unable to load the "${this.table}" table!`);
        this.tableDef = {};
        for (const col of def) {
          const type = globalThis.nostress.db.types[col.type];
          if (!type) return ShowError(`Type "${col.type}" not supported on table "${this.table}"!`);
          const isNum = SqlToJs[type] === 'decimal' || SqlToJs[type] === 'int';
          const signed = isNum ? IsSigned(col.colType) : false;
          const [min, max] = isNum ? ParseNumberSize(col.type, signed) : [null, null];
          const nullable = col.autoIncrement || col.nullable !== 'NO' || col.default != null;
          if (!nullable) this.required.push(col.name);
          this.tableDef[col.name] = {
            length: col.maxChar || null,
            nullable,
            enum: type == 'enum' ? ParseEnum(col.colType) : [],
            signed,
            exceptedType: SqlToJs[type],
            sqlType: type,
            min,
            max,
            type: col.type,
          };
        }
      } catch (e) {
        ShowError(`Unable to load the "${this.table}" table!\n${e}`);
      }
    }
  }

  public async CheckAsync(data: { [k: string]: {} }, params: ICheckSettings = {}): Promise<IError | null> {
    return await this.Check(data, params);
  }

  public Check(data: { [k: string]: {} }, params: ICheckSettings = {}): IError | null {
    try {
      if (params.required) {
        for (const k of params.required) {
          if (!this.tableDef[k])
            return {
              error: `Var "${k}" doesn't exist in definition.`,
              table: this.table,
            };
          if (!data[k])
            return {
              error: `Missing var "${k}".`,
              table: this.table,
            };
          const c = this.CheckVar(k, data[k]);
          if (c != null) return c;
        }
      } else {
        for (const r of this.required)
          if (!data[r])
            return {
              error: `Missing var "${r}".`,
              table: this.table,
            };
        for (const [key, value] of Object.entries(data)) {
          if (!params.strict && !this.tableDef[key]) continue;
          if (params.strict && !this.tableDef[key])
            return {
              error: `Var "${key}" doesn't exist in the definition.`,
              table: this.table,
            };
          const c = this.CheckVar(key, value);
          if (c != null) return c;
        }
      }
    } catch (e) {
      ShowError('Error checking ' + e);
      return {
        error: `Error while checking data.`,
        table: this.table,
      };
    }
    return null;
  }

  private CheckVar(key: string, value: any): IError | null {
    const type = ParseJsType(value);
    if (type === null)
      return {
        error: `Type of var "${key}" not supported.`,
        table: this.table,
      };
    const def = this.tableDef[key];
    if (!CheckTypes(def.exceptedType, type)) {
      const excepted = typeof def.exceptedType === 'string' ? def.exceptedType : def.exceptedType.join('" or "');
      return {
        error: `Incorrect type for the "${key}" variable. Type "${excepted}" excepted.`,
        table: this.table,
      };
    }
    if (def.exceptedType === 'string' && typeof value === 'string') {
      if (def.length && value.length > def.length)
        return {
          error: `Too many characters in var "${key}".`,
          table: this.table,
        };
    } else if (
      (def.exceptedType === 'decimal' || def.exceptedType === 'int') &&
      (typeof value === 'number' || typeof value === 'bigint')
    ) {
      if (def.min && value < def.min)
        return {
          error: `Var "${key}" too low. Min value is ${def.min} for ${def.type}.`,
          table: this.table,
        };
      if (def.max && value > def.max)
        return {
          error: `Var "${key}" too high. Max value is ${def.max} for ${def.type}.`,
          table: this.table,
        };
    }
    if (this.constraints[key]) {
      const r = TestConstraint(value, this.constraints[key], this.table, key);
      if (r) return r;
    }
    return null;
  }
}
