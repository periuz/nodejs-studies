import { afterAll, beforeAll, expect, it } from "vitest";
import request from 'supertest'
import { app } from "@/app";
import { describe } from "vitest";

describe('Authenticate (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it ('should be able to authenticate', async () => {
        await request(app.server)
            .post('/users')
            .send({
                name: 'John Doe',
                email: 'john@example.com',
                password: '12345678'
            })
        
        const response = await request(app.server).post('/sessions').send({
            email:'john@example.com',
            password:'12345678'
        })

        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual({
            token: expect.any(String)
        })
    })
})
