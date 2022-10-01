import { Database } from './database';
import { IConstraint, ISettings } from './interfaces';
import { Table } from './table';

export function Init(db: Database, settings: ISettings = {}) {
  if (!globalThis.nostress)
    globalThis.nostress = {
      db: null,
      tables: [],
    };
  globalThis.nostress.db = db;
  if (settings.refreshInterval)
    setInterval(() => {
      globalThis.nostress.tables.forEach((t) => t.Load());
    }, settings.refreshInterval * 1000);
}

export async function NewTable(name: string, constraints: { [k: string]: IConstraint } = {}): Promise<Table> {
  const t = new Table(name, constraints);
  await t.Load();
  return t;
}
