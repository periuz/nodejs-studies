import path from 'node:path'
import type { Knex } from 'knex'
import { config as dotenv } from 'dotenv'

dotenv({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
})

const databasePath = path.resolve(
  __dirname,
  'db',
  process.env.NODE_ENV === 'test' ? 'test.db' : 'app.db',
)

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: databasePath,
    },
    migrations: {
      directory: path.resolve(__dirname, 'db', 'migrations'),
      extension: 'ts',
    },
    useNullAsDefault: true,
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: databasePath,
    },
    migrations: {
      directory: path.resolve(__dirname, 'db', 'migrations'),
      extension: 'ts',
    },
    useNullAsDefault: true,
  },
}

export default config[process.env.NODE_ENV ?? 'development']
