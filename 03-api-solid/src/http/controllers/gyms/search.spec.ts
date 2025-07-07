import { afterAll, beforeAll, expect, it } from "vitest";
import request from 'supertest'
import { app } from "@/app";
import { describe } from "vitest";
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user";

describe('Search Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it ('should be able to search a gym', async () => {
        const { token } = await createAndAuthenticateUser(app)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'gym-01',
                description: 'something',
                phone: '19999999',
                latitude: -29.701568,
                longitude: -51.209682
            })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'gym-02',
                description: 'something-something',
                phone: '19999932599',
                latitude: -29.701568,
                longitude: -51.209682
            })

        const response = await request(app.server)
            .get('/gyms/search')
            .query({
                q: 'gym-01'
            })
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'gym-01'
            })
        ])
    })
})
