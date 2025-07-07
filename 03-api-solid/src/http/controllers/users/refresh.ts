import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from "zod"

export async function refresh(request: FastifyRequest, reply: FastifyReply) {

    await request.jwtVerify({ onlyCookie: true })

    const authenticateBodySchema = z.object ({
        email: z.string().email(),
        password: z.string().min(6),

    })


        const token = await reply.jwtSign(
            {
                sub: request.user.sub,
            },
            // {
            //     expiresIn: 1720332617,
            // }
        )
        const refreshToken = await reply.jwtSign(
            {
                sub: request.user.sub,
                expiresIn: '7d'
            },
            // {
            //     expiresIn: 1720332617,
            // }
        )

    return reply
        .setCookie('refreshToken', refreshToken, {
            path: '/',
            secure: true, //HTTPS
            sameSite: true,
            httpOnly: true,
        })
        .status(200).send({
        token,
    })
}