import fastify from 'fastify';
import { knex } from './database';

const app = fastify();

app.get('/hello', async () => {
  // Cria tabela se não existir
  const exists = await knex.schema.hasTable('users');
  if (!exists) {
    await knex.schema.createTable('users', (table) => {
      table.increments('id');
      table.string('name');
    });

    // Inserindo um usuário de exemplo
    await knex('users').insert({ name: 'Thiago' });
  }

  // Retorna todos os usuários
  const users = await knex('users').select('*');
  return users;
});

app.listen({ port: 3333 }).then(() => {
  console.log('Server is running on http://localhost:3333');
});
