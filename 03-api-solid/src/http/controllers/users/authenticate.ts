import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from "zod"
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object ({
        email: z.string().email(),
        password: z.string().min(6),

    })

    const { email, password } = authenticateBodySchema.parse(request.body)

    try {
        const authenticateUseCase = makeAuthenticateUseCase()

        const { user } = await authenticateUseCase.execute({
            email,
            password,
        })

        const token = await reply.jwtSign(
            // {
            //     role: user.role, // Assumes user.role is 'ADMIN' or 'MEMBER'
            // },
            {
                sign: {
                    sub: user.id,
                }
            }
            // {
            //     expiresIn: 1720332617,
            // }
        )
        const refreshToken = await reply.jwtSign(
            // {
            //     role: user.role, // Assumes user.role is 'ADMIN' or 'MEMBER'
            // },
            {
                sub: user.id,
                expiresIn: '7d'
            }
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

    } catch (err) {
       if (err instanceof InvalidCredentialsError) {
        return reply.status(400).send()
       }
       throw err
    }


}