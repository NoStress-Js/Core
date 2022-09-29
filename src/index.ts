import { Database } from './database';

export function Init(db: Database) {
  if (!globalThis.nostress)
    globalThis.nostress = {
      db: null,
      tables: [],
    };
  globalThis.nostress.db = db;
  globalThis.nostress.tables.forEach((t) => t.LoadDef());
}

export * from './table';
