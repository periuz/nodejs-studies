import path from 'node:path';
import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'db', 'app.db'),
    },
    migrations: {
      directory: path.resolve(__dirname, 'db', 'migrations'),
      extension: 'ts',
    },
    useNullAsDefault: true,
  },
};

export default config;
