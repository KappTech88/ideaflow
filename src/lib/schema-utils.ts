import type { SchemaTable } from '@/types';

/**
 * Generates SQL CREATE TABLE statements from schema tables
 * @param tables Array of schema tables
 * @param dbType Database type (sqlite, postgresql, mysql)
 * @returns SQL CREATE TABLE statements
 */
export function generateSQL(tables: SchemaTable[], dbType: string): string {
  return tables.map((table) => {
    const columns = table.columns.map((col) => {
      let type = col.type;
      if (dbType === 'mysql') {
        if (type === 'SERIAL') type = 'INT AUTO_INCREMENT';
        if (type === 'TEXT') type = 'TEXT';
      } else if (dbType === 'sqlite') {
        if (type === 'SERIAL') type = 'INTEGER';
        if (type === 'VARCHAR(255)') type = 'TEXT';
      }
      const constraints = col.constraints.join(' ');
      return `  ${col.name} ${type}${constraints ? ' ' + constraints : ''}`;
    }).join(',\n');

    return `CREATE TABLE ${table.name} (\n${columns}\n);`;
  }).join('\n\n');
}
