import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {

    await request.jwtVerify()

    console.log('request.user:',request.user)

    const getUserProfile = makeGetUserProfileUseCase()

    const { user } = await getUserProfile.execute({
        userId: request.user.sub, //It doesnt work correctly
    })

    // try {
    //     const authenticateUseCase = makeAuthenticateUseCase()

    //     await authenticateUseCase.execute({
    //         email,
    //         password,
    //     })
    // } catch (err) {
    //    if (err instanceof InvalidCredentialsError) {
    //     return reply.status(400).send()
    //    }
    //    throw err
    // }

    return reply.status(200).send({
        user,
    })
}