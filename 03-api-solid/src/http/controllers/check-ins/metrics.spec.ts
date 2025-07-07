import { afterAll, beforeAll, expect, it } from "vitest";
import request from 'supertest'
import { app } from "@/app";
import { describe } from "vitest";
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe('CheckIn Metrics (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it ('should be able to get the total count of check-ins', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const user = prisma.user.findFirstOrThrow()

        const gym = await prisma.gym.create({
            data: {
                title: 'gym-01',
                latitude: -29.701568,
                longitude: -51.209682
            }
        })

        await prisma.checkIn.createMany({
            data: [
                {   
                    gym_id: gym.id,
                    user_id: (await user).id,
                },
                {   
                    gym_id: gym.id,
                    user_id: (await user).id,
                },
            ]
        })

        const response = await request(app.server)
            .get(`/check-ins/metrics`)
            .set('Authorization', `Bearer ${token}`)
            .send()


        expect(response.statusCode).toEqual(200)
        expect(response.body.checkInsCount).toEqual(2)
    })
})
