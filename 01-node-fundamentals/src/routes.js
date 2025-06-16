import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRodePath } from './utils/build-rode-path.js';

const database = new Database();


export const routes = [
    {
        method: 'GET',
        path: buildRodePath('/users'),
        handler: (req, res) => {
            const users = database.select('users');
            
            return res
                .writeHead(200)
                .end(JSON.stringify(users));
        }
    },
    {
        method: 'POST',
        path: buildRodePath('/users'),
        handler: (req, res) => {
            const { name, email } = req.body;
            if (!name || !email) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Name and email are required' }));
            }

            const user = {
                name,
                email,
                id: randomUUID()
            }

            database.insert('users', user);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ status: 'created' }));
            }
        },
        {
            method: 'DELETE',
            path: buildRodePath('/users/:id'),
            handler: (req, res) => {
                const { id } = req.params.id;

                database.delete('users', id);

                res.writeHead(204, { 'Content-Type' : 'application/json'});
            }
        },
        {
            method: 'PUT',
            path: buildRodePath('/users/:id'),
            handler: (req, res) => {
                const { id } = req.params.id;
                const { name, email } = req.body;

                database.update('users', id, {
                    name,
                    email,
                });

                res.writeHead(204, { 'Content-Type' : 'application/json'});
            }
        }

]