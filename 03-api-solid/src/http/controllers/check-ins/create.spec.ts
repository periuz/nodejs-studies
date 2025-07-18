import { afterAll, beforeAll, expect, it } from "vitest";
import request from 'supertest'
import { app } from "@/app";
import { describe } from "vitest";
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe('Create CheckIn (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it ('should be able to create a check-in', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const gym = await prisma.gym.create({
            data: {
                title: 'gym-01',
                latitude: -29.701568,
                longitude: -51.209682
            }
        })

        const response = await request(app.server)
            .post(`/gyms/${gym.id}/checkIns`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: -29.701568,
                longitude: -51.209682   
            })


        expect(response.statusCode).toEqual(201)
    })
})
