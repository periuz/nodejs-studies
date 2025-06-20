import fastify, { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from 'middlewares/check-session-id-exists';

//Cookies <-> Ways to mantain context between requests

export async function transactionsRoutes(app: FastifyInstance) {
    app.get('/', { preHandler: [checkSessionIdExists] },async (request, reply) => {
        
        const { sessionId } = request.cookies

        const transactions = await knex('transactions')
            .where('session_id', sessionId)
            .select()

        return {transactions}
    })

    app.get('/summary', { preHandler: [checkSessionIdExists] }, async (request) => {
        const { sessionId } = request.cookies
        
        const summary = await knex('transactions')
            .sum('amount', { as: 'amount' })
            .where('session_id', sessionId)
            .first()

        return { summary }
    })
    
    app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
        const getTransactionParamsSchema = z.object ({
            id: z.string().uuid(),
        })

        const { sessionId } = request.cookies

        const { id } = getTransactionParamsSchema.parse(request.params)
    
        const transaction = await knex('transactions')
            .where({
                session_id: sessionId,
                id,
            })
            .first()

        return { transaction }
    })
    
    app.post('/', async (request, reply) => {
        // I want { title, amount, type: credit or debit}
        
        const createTransactionBodySchema = z.object ({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })
        
        const { title, amount, type} = createTransactionBodySchema.parse(request.body)

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            sessionId = randomUUID()

            reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7, //7 days
            })
        }

        await knex('transactions')
            .insert({
                id: crypto.randomUUID(),
                title,
                amount: type === 'credit' ? amount : amount * -1,
                session_id: sessionId
            })
        
        return reply.status(201).send();
    });
}