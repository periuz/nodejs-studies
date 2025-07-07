import { afterAll, beforeAll, expect, it } from "vitest";
import request from 'supertest'
import { app } from "@/app";
import { describe } from "vitest";

describe('Register (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it ('should be able to register', async () => {
        const response = await request(app.server)
            .post('/users')
            .send({
                name: 'John Doe',
                email: 'john@example.com',
                password: '12345678'
            })

        expect(response.statusCode).toEqual(201)
    })
})
