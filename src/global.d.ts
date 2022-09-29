import { Database } from './database';
import { Table } from './table';

export {};

declare global {
  var nostress: {
    db: Database | null;
    tables: Table[];
  };
}
