import { knex as setupKnex } from 'knex';
import fs from 'node:fs';
import path from 'node:path';

// Garante que a pasta 'temp' existe
const tempDir = path.resolve('temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

export const knex = setupKnex({
  client: 'sqlite3',
  connection: {
    filename: path.join(tempDir, 'app.db'),
  },
  useNullAsDefault: true,
});
