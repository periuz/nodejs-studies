import { it, expect, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { exec, execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'
import fs from 'fs'
import path from 'node:path'
import { create } from 'domain'

describe ('Transactions routes', () => {
    beforeAll(async () => {
    await app.ready()
    })

    afterAll (async () => {
        await app.close()
    })

    beforeEach(() => {
        const testDbPath = path.resolve(__dirname, '../src/db/test.db')
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath) // remove completamente
        }

        execSync('npx cross-env NODE_ENV=test knex migrate:latest --knexfile ./knexfile.ts', {
            stdio: 'inherit',
        })
    })

    it('should be able to create a new transaction', async () => {
        //Make a HTTP call to create a new transactions
        await request(app.server)
            .post('/transactions')
            .send({
                title: 'New Transaction',
                amount: 5000,
                type: 'credit',
            })
            .expect(201)
        //Validate te response
    })

    it('should be able to list all transactions', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New Transaction',
                amount: 5000,
                type: 'credit',
            })
        const cookies = createTransactionResponse.get('Set-Cookie')

        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)

        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'New Transaction',
                amount: 5000,
            })
        ])
            
    })
})

