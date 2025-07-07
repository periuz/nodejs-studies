import { afterAll, beforeAll, expect, it } from "vitest";
import request from 'supertest'
import { app } from "@/app";
import { describe } from "vitest";
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user";

describe('Create Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it ('should be able to create a gym', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const response = await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'gym-01',
                description: 'something',
                phone: '19999999',
                latitude: -29.701568,
                longitude: -51.209682
            })


        expect(response.statusCode).toEqual(201)
    })
})
