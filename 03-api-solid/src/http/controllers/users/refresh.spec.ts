import { afterAll, beforeAll, expect, it } from "vitest";
import request from 'supertest'
import { app } from "@/app";
import { describe } from "vitest";

describe('Refresh (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it ('should be able to refresh a token', async () => {
        await request(app.server)
            .post('/users')
            .send({
                name: 'John Doe',
                email: 'john@example.com',
                password: '12345678'
            })
        
        const authResponse = await request(app.server).post('/sessions').send({
            email:'john@example.com',
            password:'12345678'
        })

        const cookies = authResponse.get('Set-Cookie') ?? []

        const response = await request(app.server)
            .patch('/token/refresh')
            .set('Cookie', cookies)
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual({
            token: expect.any(String)
        })
        expect(response.get('Set-Cookie')).toEqual([
            expect.stringContaining('refreshToken='),
        ])
    })
})
